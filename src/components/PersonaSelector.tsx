import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Youtube, Github, Coffee, Star, Code, Zap, ChevronDown } from "lucide-react";
import { getAllPersonas, getPersonaById } from "@/data/personas";
import { Persona, PersonaId } from "@/types/persona";
import { cn } from "@/lib/utils";

interface PersonaSelectorProps {
    currentPersonaId: PersonaId;
    onPersonaChange: (personaId: PersonaId) => void;
    className?: string;
    compact?: boolean;
}

const PersonaSelector = ({ currentPersonaId, onPersonaChange, className, compact = false }: PersonaSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const personas = getAllPersonas();
    const currentPersona = getPersonaById(currentPersonaId);

    if (!currentPersona) return null;

    const handlePersonaSelect = (personaId: PersonaId) => {
        onPersonaChange(personaId);
        setIsOpen(false);
    };

    const getPersonaIcon = (persona: Persona) => {
        switch (persona.id) {
            case 'hitesh':
                return <Coffee className="w-4 h-4" />;
            case 'piyush':
                return <Code className="w-4 h-4" />;
            default:
                return <Star className="w-4 h-4" />;
        }
    };

    const getPersonaStats = (persona: Persona) => {
        const stats = [];
        if (persona.stats.students) stats.push({ icon: <Users className="w-3 h-3" />, label: persona.stats.students });
        if (persona.stats.subscribers) stats.push({ icon: <Youtube className="w-3 h-3" />, label: persona.stats.subscribers });
        if (persona.stats.followers) stats.push({ icon: <Github className="w-3 h-3" />, label: persona.stats.followers });
        return stats.slice(0, 2); // Show only first 2 stats
    };

    return (
        <>
            {/* Persona Selector Button */}
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className={cn(
                    compact
                        ? "h-8 px-2 gap-2 text-xs border-border/50 hover:border-primary/50 bg-background/80 backdrop-blur-sm"
                        : "h-auto p-3 justify-start gap-3 border-border/50 hover:border-primary/50 bg-background/80 backdrop-blur-sm",
                    "transition-all duration-300 hover:shadow-md",
                    className
                )}
            >
                <Avatar className={compact ? "w-5 h-5 ring-1 ring-primary/20" : "w-8 h-8 ring-2 ring-primary/20"}>
                    <AvatarImage src={currentPersona.avatar} alt={currentPersona.name} />
                    <AvatarFallback className={cn("font-bold bg-gradient-to-br text-white", compact ? "text-xs" : "text-xs", currentPersona.color.primary)}>
                        {currentPersona.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>

                {!compact && (
                    <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{currentPersona.displayName}</span>
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                {getPersonaIcon(currentPersona)}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                            {currentPersona.expertise.slice(0, 2).join(', ')}
                        </div>
                    </div>
                )}

                {compact && (
                    <span className="font-medium text-xs truncate">{currentPersona.displayName}</span>
                )}

                <ChevronDown className={compact ? "w-3 h-3 text-muted-foreground" : "w-4 h-4 text-muted-foreground"} />
            </Button>

            {/* Persona Selection Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Choose Your AI Mentor
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 mt-4">
                        {personas.map((persona) => (
                            <Card
                                key={persona.id}
                                className={cn(
                                    "cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
                                    currentPersonaId === persona.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-primary/30"
                                )}
                                onClick={() => handlePersonaSelect(persona.id as PersonaId)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                                                <AvatarImage src={persona.avatar} alt={persona.name} />
                                                <AvatarFallback className={cn("text-lg font-bold bg-gradient-to-br", persona.color.primary, "text-white")}>
                                                    {persona.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            {currentPersonaId === persona.id && (
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-lg text-foreground">{persona.displayName}</h3>
                                                <Badge variant="secondary" className="text-xs">
                                                    {getPersonaIcon(persona)}
                                                    <span className="ml-1">AI Mentor</span>
                                                </Badge>
                                                {currentPersonaId === persona.id && (
                                                    <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                                {persona.description}
                                            </p>

                                            {/* Expertise Tags */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {persona.expertise.slice(0, 4).map((skill, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {persona.expertise.length > 4 && (
                                                    <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                                                        +{persona.expertise.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                {getPersonaStats(persona).map((stat, index) => (
                                                    <div key={index} className="flex items-center gap-1">
                                                        {stat.icon}
                                                        <span>{stat.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className="flex flex-col items-center gap-2">
                                            {currentPersonaId === persona.id ? (
                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Greeting Preview */}
                                    <div className={cn(
                                        "mt-4 p-3 rounded-lg border-l-4 bg-muted/30",
                                        currentPersonaId === persona.id ? "border-primary" : "border-muted-foreground/30"
                                    )}>
                                        <p className="text-sm italic text-muted-foreground">
                                            "{persona.greeting}"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Star className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-foreground mb-1">Switch Anytime</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    You can change your AI mentor anytime during the conversation. Each mentor has their unique teaching style and expertise areas.
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PersonaSelector;