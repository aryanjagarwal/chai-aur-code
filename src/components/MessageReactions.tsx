import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  Bookmark,
  MoreHorizontal,
  Check,
  Heart,
  Lightbulb,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import TextToSpeech from "./TextToSpeech";

interface MessageReactionsProps {
  messageId: string;
  content: string;
  isUser: boolean;
  onReaction?: (messageId: string, reaction: string) => void;
  onBookmark?: (messageId: string) => void;
  reactions?: { [key: string]: number };
  isBookmarked?: boolean;
}

const MessageReactions = ({
  messageId,
  content,
  isUser,
  onReaction,
  onBookmark,
  reactions = {},
  isBookmarked = false
}: MessageReactionsProps) => {
  const [copied, setCopied] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const { toast } = useToast();

  const reactionEmojis = [
    { emoji: '👍', name: 'thumbs_up', label: 'Helpful' },
    { emoji: '❤️', name: 'heart', label: 'Love it' },
    { emoji: '💡', name: 'lightbulb', label: 'Insightful' },
    { emoji: '⚡', name: 'zap', label: 'Amazing' },
    { emoji: '👎', name: 'thumbs_down', label: 'Not helpful' },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const shareMessage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Message from Hitesh Choudhary AI',
          text: content,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const handleReaction = (reactionName: string) => {
    onReaction?.(messageId, reactionName);
    toast({
      title: "Reaction added!",
      description: `You reacted with ${reactionEmojis.find(r => r.name === reactionName)?.emoji}`,
    });
  };

  const handleBookmark = () => {
    onBookmark?.(messageId);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmarked!",
      description: isBookmarked ? "Message removed from bookmarks" : "Message saved to bookmarks",
    });
  };

  // Don't show reactions for user messages
  if (isUser) {
    return (
      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 px-2 text-xs hover:bg-primary-foreground/10"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy message'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {/* Existing Reactions Display */}
      {Object.keys(reactions).length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {Object.entries(reactions).map(([reactionName, count]) => {
            const reaction = reactionEmojis.find(r => r.name === reactionName);
            if (!reaction || count === 0) return null;

            return (
              <Button
                key={reactionName}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-muted/50 hover:bg-muted border-border/50"
                onClick={() => handleReaction(reactionName)}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{count}</span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          {/* Quick Reactions */}
          {reactionEmojis.slice(0, showAllReactions ? reactionEmojis.length : 3).map((reaction) => (
            <Tooltip key={reaction.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(reaction.name)}
                  className="h-6 px-2 text-xs hover:bg-muted/50"
                >
                  {reaction.emoji}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{reaction.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* More Reactions */}
          {!showAllReactions && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllReactions(true)}
                  className="h-6 px-2 text-xs hover:bg-muted/50"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More reactions</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Separator */}
          <div className="w-px h-4 bg-border mx-1" />

          {/* Bookmark */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "h-6 px-2 text-xs hover:bg-muted/50",
                  isBookmarked && "text-yellow-500 hover:text-yellow-600"
                )}
              >
                <Bookmark className={cn("w-3 h-3", isBookmarked && "fill-current")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? 'Remove bookmark' : 'Bookmark message'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Copy */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 px-2 text-xs hover:bg-muted/50"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy message'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareMessage}
                className="h-6 px-2 text-xs hover:bg-muted/50"
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share message</p>
            </TooltipContent>
          </Tooltip>

          {/* Text-to-Speech */}
          <TextToSpeech text={content} className="ml-1" />
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MessageReactions;