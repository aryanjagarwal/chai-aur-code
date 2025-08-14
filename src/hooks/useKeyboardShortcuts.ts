import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
    onToggleSidebar?: () => void;
    onNewChat?: () => void;
    onSearch?: () => void;
    onExport?: () => void;
    onTemplates?: () => void;
    onClearChat?: () => void;
    onClearAllHistory?: () => void;
    onShowShortcuts?: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement ||
                (event.target as HTMLElement)?.contentEditable === 'true'
            ) {
                // Allow some shortcuts even in inputs
                if (event.key === 'Escape') {
                    (event.target as HTMLElement).blur();
                    return;
                }
                return;
            }

            const { ctrlKey, metaKey, shiftKey, key } = event;
            const isCtrl = ctrlKey || metaKey; // Support both Ctrl and Cmd

            // Prevent default for our shortcuts
            const shouldPreventDefault = () => {
                event.preventDefault();
                event.stopPropagation();
            };

            switch (true) {
                // Navigation shortcuts
                case isCtrl && key === 'k':
                    shouldPreventDefault();
                    handlers.onSearch?.();
                    break;

                case isCtrl && key === 'b':
                    shouldPreventDefault();
                    handlers.onToggleSidebar?.();
                    break;

                case isCtrl && key === 'n':
                    shouldPreventDefault();
                    handlers.onNewChat?.();
                    break;

                case isCtrl && key === '/':
                    shouldPreventDefault();
                    handlers.onShowShortcuts?.();
                    break;

                // Chat shortcuts
                case isCtrl && key === 't':
                    shouldPreventDefault();
                    handlers.onTemplates?.();
                    break;

                // Action shortcuts
                case isCtrl && key === 's':
                    shouldPreventDefault();
                    handlers.onExport?.();
                    break;

                case isCtrl && key === 'f':
                    shouldPreventDefault();
                    handlers.onSearch?.();
                    break;

                case isCtrl && key === 'd':
                    shouldPreventDefault();
                    if (shiftKey) {
                        handlers.onClearAllHistory?.();
                    } else {
                        handlers.onClearChat?.();
                    }
                    break;

                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlers]);
};