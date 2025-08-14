import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isListening?: boolean;
    onListeningChange?: (listening: boolean) => void;
}

const VoiceInput = ({ onTranscript, isListening = false, onListeningChange }: VoiceInputProps) => {
    const [isSupported, setIsSupported] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();

            const recognition = recognitionRef.current;
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsActive(true);
                onListeningChange?.(true);
            };

            recognition.onend = () => {
                setIsActive(false);
                onListeningChange?.(false);
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    onTranscript(finalTranscript.trim());
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsActive(false);
                onListeningChange?.(false);

                let errorMessage = 'Speech recognition failed';
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not accessible. Please check permissions.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone permission denied.';
                        break;
                    case 'network':
                        errorMessage = 'Network error occurred during speech recognition.';
                        break;
                }

                toast({
                    title: "Voice Input Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onTranscript, onListeningChange, toast]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isActive) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                toast({
                    title: "Voice Input Active",
                    description: "Speak now... I'm listening!",
                });
            } catch (error) {
                toast({
                    title: "Voice Input Failed",
                    description: "Could not start voice recognition.",
                    variant: "destructive",
                });
            }
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleListening}
                        className={cn(
                            "h-8 w-8 p-0 transition-all duration-300",
                            isActive
                                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                                : "hover:bg-muted/50"
                        )}
                    >
                        {isActive ? (
                            <div className="relative">
                                <MicOff className="w-4 h-4" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                            </div>
                        ) : (
                            <Mic className="w-4 h-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isActive ? 'Stop listening' : 'Start voice input'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default VoiceInput;