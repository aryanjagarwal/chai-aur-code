import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coffee } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 p-6 max-w-4xl mx-auto animate-fade-in">
      <Avatar className="w-10 h-10 shrink-0 ring-2 ring-accent/20">
        <AvatarImage src="/hitesh-avatar.png" alt="Hitesh Choudhary" />
        <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground font-semibold">
          <Coffee className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gradient-to-br from-background to-muted/50 text-foreground rounded-2xl rounded-tl-md px-5 py-4 shadow-lg border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Hitesh is thinking</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 opacity-60">
          Brewing the perfect response... ☕
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;