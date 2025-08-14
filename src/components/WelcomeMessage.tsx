import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, BookOpen, Users, Zap, Coffee, Star, Play, Github, Youtube } from "lucide-react";
import { getPersonaById } from "@/data/personas";
import { PersonaId } from "@/types/persona";
import { cn } from "@/lib/utils";

interface WelcomeMessageProps {
  currentPersona: PersonaId;
}

const WelcomeMessage = ({ currentPersona }: WelcomeMessageProps) => {
  const persona = getPersonaById(currentPersona);

  if (!persona) return null;
  const getSuggestions = () => {
    if (persona.id === 'hitesh') {
      return [
        {
          icon: <Code className="w-5 h-5" />,
          title: "Code Examples",
          question: "Show me a React component with hooks",
          color: "from-blue-500 to-blue-600"
        },
        {
          icon: <BookOpen className="w-5 h-5" />,
          title: "Career Guidance",
          question: "How do I transition into tech from a non-tech background?",
          color: "from-green-500 to-green-600"
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: "JavaScript Help",
          question: "Explain async/await with code examples",
          color: "from-purple-500 to-purple-600"
        },
        {
          icon: <Zap className="w-5 h-5" />,
          title: "Node.js API",
          question: "Create a REST API with Express.js",
          color: "from-orange-500 to-orange-600"
        }
      ];
    } else {
      return [
        {
          icon: <Code className="w-5 h-5" />,
          title: "Full-Stack Project",
          question: "Build a complete MERN stack application",
          color: "from-blue-500 to-blue-600"
        },
        {
          icon: <BookOpen className="w-5 h-5" />,
          title: "System Design",
          question: "How to design a scalable web application?",
          color: "from-green-500 to-green-600"
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: "Modern JavaScript",
          question: "Latest ES6+ features and best practices",
          color: "from-purple-500 to-purple-600"
        },
        {
          icon: <Zap className="w-5 h-5" />,
          title: "Performance",
          question: "Optimize React app for better performance",
          color: "from-orange-500 to-orange-600"
        }
      ];
    }
  };

  const suggestions = getSuggestions();

  const getStats = () => {
    const stats = [];
    if (persona.stats.students) stats.push({ icon: <Users className="w-4 h-4" />, label: persona.stats.students, value: "Worldwide" });
    if (persona.stats.subscribers) stats.push({ icon: <Youtube className="w-4 h-4" />, label: persona.stats.subscribers, value: persona.id === 'hitesh' ? "Chai aur Code" : "Dev Tutorials" });
    if (persona.stats.followers) stats.push({ icon: <Github className="w-4 h-4" />, label: persona.stats.followers, value: "GitHub" });
    if (persona.stats.videos) stats.push({ icon: <Star className="w-4 h-4" />, label: persona.stats.videos, value: "Free Content" });
    return stats;
  };

  const stats = getStats();

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-3xl"></div>
          <div className="relative space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              {persona.id === 'hitesh' ? (
                <Coffee className="w-8 h-8 text-primary animate-bounce" />
              ) : (
                <Code className="w-8 h-8 text-primary animate-bounce" />
              )}
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {persona.id === 'hitesh' ? 'Namaste Coders!' : 'Hey Developers!'}
              </h2>
              <div className="text-4xl animate-wave">
                {persona.id === 'hitesh' ? '🙏' : '🚀'}
              </div>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              I'm <span className="font-semibold text-primary">{persona.displayName}</span>, and I'm here to help you with your coding journey.
              {persona.id === 'hitesh' ? (
                <>Whether you're a beginner or looking to level up your skills, let's{" "}
                  <span className="font-semibold text-accent">chai aur code</span> together!</>
              ) : (
                <>Whether you're building your first app or scaling to production, let's{" "}
                  <span className="font-semibold text-accent">build something amazing</span> together!</>
              )}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {persona.expertise.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-700 dark:text-blue-300">
              <Code className="w-4 h-4 mr-2" />
              {skill}
            </Badge>
          ))}
          <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/20 text-red-700 dark:text-red-300">
            <Youtube className="w-4 h-4 mr-2" />
            YouTube Educator
          </Badge>
          {persona.id === 'hitesh' && (
            <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20 text-green-700 dark:text-green-300">
              <Coffee className="w-4 h-4 mr-2" />
              ChaiCode Founder
            </Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-center mb-2 text-primary">
                {stat.icon}
              </div>
              <div className="text-center">
                <div className="font-bold text-sm text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-foreground">
          Popular Questions to Get Started
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 hover:from-muted/30 hover:to-muted/10"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${suggestion.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.question}
                    </p>
                  </div>
                  <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
        <Coffee className="w-12 h-12 text-primary mx-auto animate-pulse" />
        <h3 className="text-xl font-semibold text-foreground">Ready to Start Your Journey?</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Type your question below, click on any suggestion above, or just say hello! I'm here to help you become a better developer.
        </p>
        <Button variant="outline" className="mt-4 border-primary/30 hover:bg-primary/10">
          <Zap className="w-4 h-4 mr-2" />
          Let's Code Together
        </Button>
      </div>
    </div>
  );
};

export default WelcomeMessage;