import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coffee, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-chat-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 text-center space-y-8 p-8 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center animate-float">
            <Coffee className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Chai Break! ☕
            </h2>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Looks like this page went for a chai break and never came back! 
            Don't worry, let's get you back to coding.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Path not found:</span> {location.pathname}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Back to Chai aur Code
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          "Debugging is like being the detective in a crime movie where you are also the murderer." - Filipe Fortes
        </div>
      </div>
    </div>
  );
};

export default NotFound;
