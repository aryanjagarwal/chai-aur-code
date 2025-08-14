import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Keyboard, Command } from "lucide-react";

interface KeyboardShortcutsProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Shortcut {
    keys: string[];
    description: string;
    category: string;
}

const KeyboardShortcuts = ({ isOpen, onClose }: KeyboardShortcutsProps) => {
    const shortcuts: Shortcut[] = [
        // Navigation
        { keys: ['Ctrl', 'K'], description: 'Open command palette / Search', category: 'Navigation' },
        { keys: ['Ctrl', 'B'], description: 'Toggle sidebar', category: 'Navigation' },
        { keys: ['Ctrl', 'N'], description: 'New chat', category: 'Navigation' },
        { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', category: 'Navigation' },
        { keys: ['Escape'], description: 'Close dialogs/modals', category: 'Navigation' },

        // Chat
        { keys: ['Enter'], description: 'Send message', category: 'Chat' },
        { keys: ['Shift', 'Enter'], description: 'New line in message', category: 'Chat' },
        { keys: ['Ctrl', 'Enter'], description: 'Send message (alternative)', category: 'Chat' },
        { keys: ['Ctrl', 'T'], description: 'Open message templates', category: 'Chat' },

        // Actions
        { keys: ['Ctrl', 'S'], description: 'Export current chat', category: 'Actions' },
        { keys: ['Ctrl', 'F'], description: 'Search in messages', category: 'Actions' },
        { keys: ['Ctrl', 'D'], description: 'Clear current chat', category: 'Actions' },
        { keys: ['Ctrl', 'Shift', 'D'], description: 'Clear all chat history', category: 'Actions' },

        // Code
        { keys: ['Ctrl', 'C'], description: 'Copy code block', category: 'Code' },
        { keys: ['Ctrl', 'Shift', 'F'], description: 'Full screen code view', category: 'Code' },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Copy message content', category: 'Code' },
    ];

    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
    }, {} as Record<string, Shortcut[]>);

    const formatKey = (key: string) => {
        const keyMap: Record<string, string> = {
            'Ctrl': '⌘',
            'Shift': '⇧',
            'Alt': '⌥',
            'Enter': '↵',
            'Escape': 'Esc',
            'Backspace': '⌫',
            'Delete': '⌦',
            'Tab': '⇥',
            'Space': '␣',
        };

        return keyMap[key] || key;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-primary" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Speed up your workflow with these keyboard shortcuts.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Command className="w-4 h-4 text-primary" />
                                {category}
                            </h3>

                            <div className="space-y-2">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <span className="text-sm text-foreground">
                                            {shortcut.description}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIndex) => (
                                                <div key={keyIndex} className="flex items-center gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="px-2 py-1 text-xs font-mono bg-muted/50 border-border"
                                                    >
                                                        {formatKey(key)}
                                                    </Badge>
                                                    {keyIndex < shortcut.keys.length - 1 && (
                                                        <span className="text-xs text-muted-foreground">+</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {category !== Object.keys(groupedShortcuts)[Object.keys(groupedShortcuts).length - 1] && (
                                <Separator className="mt-4" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Command className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Pro Tip</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Most shortcuts work globally throughout the app. Press <Badge variant="outline" className="mx-1 text-xs">Ctrl + /</Badge> anytime to see this help.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default KeyboardShortcuts;