import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Search, 
  History, 
  Coffee,
  Calendar,
  Clock,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChatHistory } from "@/hooks/useChatHistory";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onLoadChat: (sessionId: string) => void;
}

const ChatSidebar = ({ isOpen, onClose, onNewChat, onLoadChat }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { sessions, currentSessionId, deleteSession, clearAllSessions } = useChatHistory();

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const groupSessionsByDate = (sessions: typeof filteredSessions) => {
    const groups: { [key: string]: typeof sessions } = {};
    const now = new Date();
    
    sessions.forEach(session => {
      const diffInDays = Math.floor((now.getTime() - session.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
      
      let groupKey;
      if (diffInDays === 0) groupKey = "Today";
      else if (diffInDays === 1) groupKey = "Yesterday";
      else if (diffInDays < 7) groupKey = "This Week";
      else if (diffInDays < 30) groupKey = "This Month";
      else groupKey = "Older";
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(session);
    });
    
    return groups;
  };

  const sessionGroups = groupSessionsByDate(filteredSessions);

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Chat History</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={onNewChat}
              className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {Object.keys(sessionGroups).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat history yet</p>
                <p className="text-xs">Start a conversation to see it here</p>
              </div>
            ) : (
              Object.entries(sessionGroups).map(([groupName, groupSessions]) => (
                <div key={groupName} className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {groupName}
                  </div>
                  
                  <div className="space-y-1">
                    {groupSessions.map((session) => (
                      <div
                        key={session.id}
                        className={cn(
                          "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                          "hover:bg-muted/50",
                          currentSessionId === session.id ? "bg-primary/10 border border-primary/20" : ""
                        )}
                        onClick={() => onLoadChat(session.id)}
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {session.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(session.updatedAt)}
                            <span>•</span>
                            <span>{session.messages.length} messages</span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {sessions.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllSessions}
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All History
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;