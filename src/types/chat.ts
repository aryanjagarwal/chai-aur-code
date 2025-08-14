export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sequence: number;
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