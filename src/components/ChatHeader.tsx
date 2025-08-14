import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Youtube, Github, Coffee, Star, Menu, Search, Download } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar?: () => void;
  onToggleSearch?: () => void;
  onToggleExport?: () => void;
  hasMessages?: boolean;
}

const ChatHeader = ({ onToggleSidebar, onToggleSearch, onToggleExport, hasMessages = false }: ChatHeaderProps) => {
  return (
    <div className="border-b border-border/50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-14 h-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-primary/40">
              <AvatarImage src="/hitesh-avatar.png" alt="Hitesh Choudhary" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                HC
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse shadow-lg"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Hitesh Choudhary
              </h1>
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                <Coffee className="w-3 h-3 mr-1" />
                AI Assistant
              </Badge>
              <Badge variant="outline" className="text-xs border-yellow-400/30 text-yellow-600 dark:text-yellow-400">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Verified
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-medium">1.5M+ Students</span>
              </div>
              <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="font-medium">Chai aur Code</span>
              </div>
              <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                <Github className="w-4 h-4 text-purple-500" />
                <span className="font-medium">GitHub Star</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            {hasMessages && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSearch}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExport}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              <Menu className="w-4 h-4" />
            </Button>
            
            <div className="text-right flex flex-col items-end ml-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Online</span>
              </div>
              <div className="text-xs text-muted-foreground">Ready to help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;