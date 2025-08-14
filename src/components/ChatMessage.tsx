import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Coffee, Code } from "lucide-react";
import MessageContent from "./MessageContent";
import MessageReactions from "./MessageReactions";
import { PersonaId } from "@/types/persona";
import { getPersonaById } from "@/data/personas";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  messageId?: string;
  onReaction?: (messageId: string, reaction: string) => void;
  onBookmark?: (messageId: string) => void;
  reactions?: { [key: string]: number };
  isBookmarked?: boolean;
  messagePersonaId?: PersonaId; // The persona that created this specific message
  currentPersona?: PersonaId; // Current active persona (fallback only)
}

const ChatMessage = ({
  message,
  isUser,
  timestamp,
  messageId,
  onReaction,
  onBookmark,
  reactions,
  isBookmarked,
  messagePersonaId,
  currentPersona = "hitesh",
}: ChatMessageProps) => {
  // Use the message's original persona, fallback to current persona for legacy messages
  const effectivePersonaId = !isUser
    ? messagePersonaId || currentPersona
    : currentPersona;
  const persona = getPersonaById(effectivePersonaId);

  const getPersonaIcon = () => {
    switch (effectivePersonaId) {
      case "hitesh":
        return <Coffee className="w-5 h-5" />;
      case "piyush":
        return <Code className="w-5 h-5" />;
      default:
        return <Coffee className="w-5 h-5" />;
    }
  };
  return (
    <div
      id={messageId ? `message-${messageId}` : undefined}
      className={cn(
        "flex gap-4 p-6 max-w-4xl mx-auto group hover:bg-muted/20 transition-all duration-300 rounded-lg",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar
        className={cn(
          "w-10 h-10 shrink-0 transition-all duration-300 group-hover:scale-105",
          isUser ? "ring-2 ring-primary/20" : "ring-2 ring-accent/20"
        )}
      >
        {isUser ? (
          <>
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage
              src={persona?.avatar || "/hitesh-avatar.png"}
              alt={persona?.displayName || "AI Assistant"}
            />
            <AvatarFallback
              className={cn(
                "font-semibold text-white bg-gradient-to-br",
                persona?.color.primary || "from-accent to-accent/80"
              )}
            >
              {getPersonaIcon()}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "rounded-2xl px-5 py-4 max-w-[85%] shadow-lg transition-all duration-300 group-hover:shadow-xl",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-md shadow-primary/20"
            : "bg-gradient-to-br from-background to-muted/50 text-foreground rounded-tl-md border border-border/50 shadow-muted/20"
        )}
      >
        <MessageContent content={message} isUser={isUser} />

        <div
          className={cn(
            "text-xs mt-3 opacity-60 font-medium flex items-center gap-1",
            isUser
              ? "justify-end text-primary-foreground/80"
              : "justify-start text-muted-foreground"
          )}
        >
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isUser ? "bg-primary-foreground/60" : "bg-muted-foreground/60"
            )}
          ></div>
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Message Reactions */}
        {messageId && (
          <MessageReactions
            messageId={messageId}
            content={message}
            isUser={isUser}
            onReaction={onReaction}
            onBookmark={onBookmark}
            reactions={reactions}
            isBookmarked={isBookmarked}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
