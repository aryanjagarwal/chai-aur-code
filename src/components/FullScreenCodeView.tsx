import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Maximize2,
    Minimize2,
    Copy,
    Check,
    Download,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FullScreenCodeViewProps {
    code: string;
    language: string;
    filename?: string;
    isOpen: boolean;
    onClose: () => void;
}

const FullScreenCodeView = ({
    code,
    language,
    filename,
    isOpen,
    onClose
}: FullScreenCodeViewProps) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: "Copied!",
                description: "Code copied to clipboard",
            });
        } catch (err) {
            toast({
                title: "Copy failed",
                description: "Failed to copy code",
                variant: "destructive",
            });
        }
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `code.${language}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Downloaded!",
            description: `Code saved as ${filename || `code.${language}`}`,
        });
    };

    const getLanguageIcon = (lang: string) => {
        switch (lang.toLowerCase()) {
            case 'javascript':
            case 'js':
                return '🟨';
            case 'typescript':
            case 'ts':
                return '🔷';
            case 'python':
            case 'py':
                return '🐍';
            case 'html':
                return '🌐';
            case 'css':
                return '🎨';
            case 'react':
            case 'jsx':
            case 'tsx':
                return '⚛️';
            default:
                return '📄';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 gap-0">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{getLanguageIcon(language)}</span>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground capitalize">
                                {language} Code
                            </h2>
                            {filename && (
                                <p className="text-sm text-muted-foreground font-mono">
                                    {filename}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="h-8"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-500 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadCode}
                            className="h-8"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Code Content */}
                <div className="flex-1 relative">
                    <ScrollArea className="h-full">
                        <div className="relative">
                            {/* Line Numbers */}
                            <div className="absolute left-0 top-0 p-4 text-xs text-muted-foreground/50 font-mono select-none pointer-events-none bg-muted/10 border-r border-border">
                                {code.split('\n').map((_, index) => (
                                    <div key={index} className="leading-6 text-right pr-4 min-w-[3rem]">
                                        {index + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Code */}
                            <pre className="p-4 pl-20 text-sm leading-6 bg-gradient-to-br from-background to-muted/10 min-h-full">
                                <code className="font-mono text-foreground whitespace-pre">
                                    {code}
                                </code>
                            </pre>
                        </div>
                    </ScrollArea>

                    {/* Stats Footer */}
                    <div className="absolute bottom-0 left-0 right-0 bg-muted/30 border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span>{code.split('\n').length} lines</span>
                            <span>{code.length} characters</span>
                            <span>{code.split(/\s+/).length} words</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Full Screen View</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FullScreenCodeView;