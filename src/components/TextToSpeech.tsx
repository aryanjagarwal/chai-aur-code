import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
    text: string;
    autoPlay?: boolean;
    className?: string;
}

const TextToSpeech = ({ text, autoPlay = false, className }: TextToSpeechProps) => {
    const [isSupported, setIsSupported] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setIsSupported('speechSynthesis' in window);
    }, []);

    useEffect(() => {
        if (autoPlay && isSupported && text) {
            handleSpeak();
        }
    }, [text, autoPlay, isSupported]);

    const cleanTextForSpeech = (text: string) => {
        // Remove code blocks and markdown formatting for better speech
        return text
            .replace(/```[\s\S]*?```/g, ' [Code Block] ')
            .replace(/`([^`]+)`/g, ' $1 ')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/#{1,6}\s/g, '')
            .replace(/\n+/g, '. ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const handleSpeak = () => {
        if (!isSupported) {
            toast({
                title: "Text-to-Speech Not Supported",
                description: "Your browser doesn't support text-to-speech.",
                variant: "destructive",
            });
            return;
        }

        if (isPlaying) {
            if (isPaused) {
                speechSynthesis.resume();
                setIsPaused(false);
            } else {
                speechSynthesis.pause();
                setIsPaused(true);
            }
            return;
        }

        // Stop any ongoing speech
        speechSynthesis.cancel();

        const cleanedText = cleanTextForSpeech(text);
        if (!cleanedText) return;

        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utteranceRef.current = utterance;

        // Configure voice settings
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        // Try to use a more natural voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.lang.startsWith('en')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsPlaying(false);
            setIsPaused(false);
            toast({
                title: "Speech Error",
                description: "Failed to play text-to-speech.",
                variant: "destructive",
            });
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        speechSynthesis.speak(utterance);
    };

    const handleStop = () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    if (!isSupported || !text) {
        return null;
    }

    return (
        <TooltipProvider>
            <div className={cn("flex items-center gap-1", className)}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSpeak}
                            className={cn(
                                "h-6 px-2 text-xs hover:bg-muted/50 transition-all duration-200",
                                isPlaying && "text-primary"
                            )}
                        >
                            {isPlaying ? (
                                isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />
                            ) : (
                                <Volume2 className="w-3 h-3" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            {isPlaying
                                ? (isPaused ? 'Resume speech' : 'Pause speech')
                                : 'Read aloud'
                            }
                        </p>
                    </TooltipContent>
                </Tooltip>

                {isPlaying && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleStop}
                                className="h-6 px-2 text-xs hover:bg-muted/50"
                            >
                                <VolumeX className="w-3 h-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Stop speech</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
};

export default TextToSpeech;