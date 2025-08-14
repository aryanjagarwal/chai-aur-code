import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coffee, Code } from "lucide-react";
import { PersonaId } from "@/types/persona";
import { getPersonaById } from "@/data/personas";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  currentPersona?: PersonaId;
}

const TypingIndicator = ({
  currentPersona = "hitesh",
}: TypingIndicatorProps) => {
  const persona = getPersonaById(currentPersona);

  const getPersonaIcon = () => {
    switch (currentPersona) {
      case "hitesh":
        return <Coffee className="w-5 h-5" />;
      case "piyush":
        return <Code className="w-5 h-5" />;
      default:
        return <Coffee className="w-5 h-5" />;
    }
  };

  const getThinkingMessage = () => {
    switch (currentPersona) {
      case "hitesh":
        return "Brewing the perfect response... ☕";
      case "piyush":
        return "Crafting a practical solution... 💻";
      default:
        return "Thinking...";
    }
  };

  const getAvatarSrc = () => {
    switch (currentPersona) {
      case "hitesh":
        return "/hitesh-avatar.png";
      case "piyush":
        return "/piyush-avatar.png"; // Add this avatar to public folder
      default:
        return "/hitesh-avatar.png";
    }
  };

  if (!persona) return null;

  return (
    <div className="flex gap-4 p-6 max-w-4xl mx-auto animate-fade-in">
      <Avatar className="w-10 h-10 shrink-0 ring-2 ring-accent/20">
        <AvatarImage src={getAvatarSrc()} alt={persona.name} />
        <AvatarFallback
          className={cn(
            "font-semibold text-white bg-gradient-to-br",
            persona.color.primary
          )}
        >
          {getPersonaIcon()}
        </AvatarFallback>
      </Avatar>

      <div className="bg-gradient-to-br from-background to-muted/50 text-foreground rounded-2xl rounded-tl-md px-5 py-4 shadow-lg border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {persona.displayName} is thinking
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 opacity-60">
          {getThinkingMessage()}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
