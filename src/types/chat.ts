import { PersonaId } from "./persona";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sequence: number;
  personaId?: PersonaId; // Store which persona created this message
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}