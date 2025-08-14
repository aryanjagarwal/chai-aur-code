import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Play, Terminal, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FullScreenCodeView from "./FullScreenCodeView";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const CodeBlock = ({ code, language = "javascript", filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
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
      case 'node':
      case 'nodejs':
        return '🟢';
      case 'bash':
      case 'shell':
      case 'sh':
        return '💻';
      case 'json':
        return '📋';
      case 'sql':
        return '🗃️';
      case 'php':
        return '🐘';
      case 'java':
        return '☕';
      case 'cpp':
      case 'c++':
        return '⚙️';
      case 'go':
        return '🐹';
      case 'rust':
        return '🦀';
      case 'vue':
        return '💚';
      case 'angular':
        return '🅰️';
      default:
        return '📄';
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'typescript':
      case 'ts':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'python':
      case 'py':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'html':
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'css':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'react':
      case 'jsx':
      case 'tsx':
        return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30';
      case 'node':
      case 'nodejs':
        return 'from-green-600/20 to-green-700/20 border-green-600/30';
      case 'bash':
      case 'shell':
      case 'sh':
        return 'from-gray-600/20 to-gray-700/20 border-gray-600/30';
      case 'json':
        return 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30';
      case 'sql':
        return 'from-blue-600/20 to-blue-700/20 border-blue-600/30';
      case 'php':
        return 'from-purple-600/20 to-purple-700/20 border-purple-600/30';
      case 'java':
        return 'from-red-500/20 to-red-600/20 border-red-500/30';
      case 'go':
        return 'from-cyan-600/20 to-cyan-700/20 border-cyan-600/30';
      case 'rust':
        return 'from-orange-600/20 to-orange-700/20 border-orange-600/30';
      case 'vue':
        return 'from-green-400/20 to-green-500/20 border-green-400/30';
      case 'angular':
        return 'from-red-600/20 to-red-700/20 border-red-600/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 bg-gradient-to-r border-b border-border/50",
        getLanguageColor(language)
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getLanguageIcon(language)}</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {language}
            </span>
          </div>
          {filename && (
            <>
              <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
              <span className="text-sm text-muted-foreground font-mono">
                {filename}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-3 hover:bg-background/50 transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullScreen(true)}
            className="h-8 px-3 hover:bg-background/50 transition-all duration-200"
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            <span className="text-xs">Expand</span>
          </Button>

          {(language === 'javascript' || language === 'js' || language === 'node') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-background/50 transition-all duration-200"
              onClick={() => {
                // This could be extended to actually run code in a sandbox
                console.log('Running code:', code);
              }}
            >
              <Play className="w-4 h-4 mr-1" />
              <span className="text-xs">Run</span>
            </Button>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 ml-6 overflow-x-auto text-sm leading-relaxed bg-gradient-to-br from-background/50 to-muted/20">
          <code className="font-mono text-foreground whitespace-pre">
            {code}
          </code>
        </pre>

        {/* Line numbers for longer code blocks */}
        {code.split('\n').length > 5 && (
          <div className="absolute left-0 top-0 p-4 text-xs text-muted-foreground/50 font-mono select-none pointer-events-none">
            {code.split('\n').map((_, index) => (
              <div key={index} className="leading-relaxed">
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer for longer code blocks */}
      {code.split('\n').length > 10 && (
        <div className="px-4 py-2 bg-muted/20 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>{code.split('\n').length} lines</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Ready to copy</span>
          </div>
        </div>
      )}

      {/* Full Screen Modal */}
      <FullScreenCodeView
        code={code}
        language={language}
        filename={filename}
        isOpen={showFullScreen}
        onClose={() => setShowFullScreen(false)}
      />
    </div>
  );
};

export default CodeBlock;