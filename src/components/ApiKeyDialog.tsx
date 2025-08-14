import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, ExternalLink, Zap, Shield, Coffee, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeyDialogProps {
  open: boolean;
  onApiKeySubmit: (openaiKey: string, geminiKey?: string) => void;
}

const ApiKeyDialog = ({ open, onApiKeySubmit }: ApiKeyDialogProps) => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openaiKey.trim() || geminiKey.trim()) {
      onApiKeySubmit(openaiKey.trim(), geminiKey.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
            <Coffee className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Welcome to Chai aur Code AI
          </DialogTitle>
          <DialogDescription className="space-y-2 text-center">
            <p className="text-base">Connect with Hitesh Choudhary's AI assistant to get personalized coding guidance.</p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Your API keys are stored locally and never sent to our servers</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="border-primary/20 bg-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            Choose your preferred AI provider. Both services offer excellent responses with Hitesh's teaching style.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="openai" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="openai" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  OpenAI
                </div>
              </TabsTrigger>
              <TabsTrigger value="gemini" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gemini
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="openai" className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label htmlFor="openai-key" className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  OpenAI API Key (Primary)
                </Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showOpenaiKey ? "text" : "password"}
                    placeholder="sk-proj-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="pr-12 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-muted/50"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  >
                    {showOpenaiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="gemini-key" className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gemini API Key (Fallback)
                </Label>
                <div className="relative">
                  <Input
                    id="gemini-key"
                    type={showGeminiKey ? "text" : "password"}
                    placeholder="AIza..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="pr-12 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-muted/50"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                  >
                    {showGeminiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Gemini will be used automatically if OpenAI fails
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="gemini" className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label htmlFor="gemini-key-primary" className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gemini API Key (Primary)
                </Label>
                <div className="relative">
                  <Input
                    id="gemini-key-primary"
                    type={showGeminiKey ? "text" : "password"}
                    placeholder="AIza..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="pr-12 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-muted/50"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                  >
                    {showGeminiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="openai-key-fallback" className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  OpenAI API Key (Fallback)
                </Label>
                <div className="relative">
                  <Input
                    id="openai-key-fallback"
                    type={showOpenaiKey ? "text" : "password"}
                    placeholder="sk-proj-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="pr-12 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-muted/50"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  >
                    {showOpenaiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  OpenAI will be used automatically if Gemini fails
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Get Your API Keys
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 border-green-500/20 hover:bg-green-500/10"
                asChild
              >
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  OpenAI Keys
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 border-blue-500/20 hover:bg-blue-500/10"
                asChild
              >
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Gemini Keys
                </a>
              </Button>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={!openaiKey.trim() && !geminiKey.trim()}
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Start Chai aur Code Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;