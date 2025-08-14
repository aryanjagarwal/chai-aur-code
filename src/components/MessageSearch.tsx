import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  X,
  Filter,
  User,
  Bot,
  Code,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { PersonaId } from "@/types/persona";
import { getPersonaById } from "@/data/personas";

interface MessageSearchProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  onMessageSelect: (messageId: string) => void;
  currentPersona?: PersonaId;
}

type FilterType = "all" | "user" | "ai" | "code";
type SortType = "newest" | "oldest" | "relevance";

const MessageSearch = ({
  messages,
  isOpen,
  onClose,
  onMessageSelect,
  currentPersona = "hitesh",
}: MessageSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("newest");

  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((message) =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((message) => {
        switch (filterType) {
          case "user":
            return message.isUser;
          case "ai":
            return !message.isUser;
          case "code":
            return (
              message.content.includes("```") || message.content.includes("`")
            );
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortType) {
        case "newest":
          return b.timestamp.getTime() - a.timestamp.getTime();
        case "oldest":
          return a.timestamp.getTime() - b.timestamp.getTime();
        case "relevance":
          if (!searchQuery.trim())
            return b.timestamp.getTime() - a.timestamp.getTime();
          // Simple relevance scoring based on query matches
          const aMatches = (
            a.content
              .toLowerCase()
              .match(new RegExp(searchQuery.toLowerCase(), "g")) || []
          ).length;
          const bMatches = (
            b.content
              .toLowerCase()
              .match(new RegExp(searchQuery.toLowerCase(), "g")) || []
          ).length;
          return bMatches - aMatches;
        default:
          return 0;
      }
    });

    return filtered;
  }, [messages, searchQuery, filterType, sortType]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Search Messages</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Search in conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter:</span>
              </div>

              {(["all", "user", "ai", "code"] as FilterType[]).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="h-7 text-xs"
                >
                  {type === "user" && <User className="w-3 h-3 mr-1" />}
                  {type === "ai" && <Bot className="w-3 h-3 mr-1" />}
                  {type === "code" && <Code className="w-3 h-3 mr-1" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              {(["newest", "oldest", "relevance"] as SortType[]).map((type) => (
                <Button
                  key={type}
                  variant={sortType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortType(type)}
                  className="h-7 text-xs"
                >
                  {type === "newest" && <ArrowDown className="w-3 h-3 mr-1" />}
                  {type === "oldest" && <ArrowUp className="w-3 h-3 mr-1" />}
                  {type === "relevance" && <Search className="w-3 h-3 mr-1" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-h-0">
          <div className="p-4 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedMessages.length} result
                {filteredAndSortedMessages.length !== 1 ? "s" : ""} found
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  "{searchQuery}"
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredAndSortedMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages found</p>
                  <p className="text-xs">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAndSortedMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        onMessageSelect(message.id);
                        onClose();
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          )}
                        >
                          {message.isUser ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-foreground">
                              {message.isUser
                                ? "You"
                                : (() => {
                                    const messagePersona =
                                      message.personaId || currentPersona;
                                    const persona =
                                      getPersonaById(messagePersona);
                                    return (
                                      persona?.displayName || "AI Assistant"
                                    );
                                  })()}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(message.timestamp)}
                            </div>
                            {message.content.includes("```") && (
                              <Badge variant="outline" className="text-xs h-4">
                                <Code className="w-2 h-2 mr-1" />
                                Code
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {highlightText(
                              message.content.length > 150
                                ? message.content.slice(0, 150) + "..."
                                : message.content,
                              searchQuery
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MessageSearch;
