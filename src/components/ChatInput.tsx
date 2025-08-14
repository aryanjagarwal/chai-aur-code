import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles, Coffee, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import VoiceInput from "./VoiceInput";
import MessageTemplates from "./MessageTemplates";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + transcript);
  };

  const handleTemplateSelect = (templateContent: string) => {
    setMessage(templateContent);
  };

  const quickPrompts = [
    "Show me a React component example",
    "Write a JavaScript function for API calls",
    "Create a Node.js Express server",
    "Explain closures with code"
  ];

  return (
    <div className="border-t border-border/50 bg-gradient-to-t from-background via-background/98 to-background/95 backdrop-blur-md">
      <div className="max-w-4xl mx-auto p-6">
        {/* Quick Prompts */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
            className="whitespace-nowrap text-xs bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/50 transition-all duration-300 text-primary"
          >
            <FileText className="w-3 h-3 mr-1" />
            Templates
          </Button>

          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(prompt)}
              className="whitespace-nowrap text-xs bg-muted/50 hover:bg-muted border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {prompt}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <Coffee className="w-4 h-4" />
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Namaste! Ask Hitesh anything about coding, career, or technology..."
              className={cn(
                "min-h-[60px] max-h-40 resize-none pl-10 pr-16 py-3",
                "border-border/50 focus:border-primary/50 focus:ring-primary/20",
                "bg-background/80 backdrop-blur-sm",
                "transition-all duration-300 rounded-xl",
                "placeholder:text-muted-foreground/70",
                isListening && "ring-2 ring-red-500/50 border-red-500/50"
              )}
              disabled={isLoading}
            />

            {/* Voice Input Button */}
            <div className="absolute right-3 top-3">
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                isListening={isListening}
                onListeningChange={setIsListening}
              />
            </div>

            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {message.length}/1000
            </div>
          </div>

          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={cn(
              "h-[60px] px-6 rounded-xl",
              "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
              "text-primary-foreground font-medium",
              "transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
              "group relative overflow-hidden"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Thinking...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </div>
            )}
          </Button>
        </form>

        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {isListening && (
              <span className="text-red-500 animate-pulse">🎤 Listening...</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Ready</span>
          </div>
        </div>

        {/* Message Templates Modal */}
        <MessageTemplates
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </div>
    </div>
  );
};

export default ChatInput;