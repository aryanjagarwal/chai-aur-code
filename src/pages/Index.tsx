import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeMessage from "@/components/WelcomeMessage";
import ApiKeyDialog from "@/components/ApiKeyDialog";
import TypingIndicator from "@/components/TypingIndicator";
import ChatSidebar from "@/components/ChatSidebar";
import MessageSearch from "@/components/MessageSearch";
import ExportChat from "@/components/ExportChat";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import PersonaSelector from "@/components/PersonaSelector";
import { sendChatMessage } from "@/services/openai";
import { Message } from "@/types/chat";
import { PersonaId } from "@/types/persona";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(true);
  const [lastUsedProvider, setLastUsedProvider] = useState<
    "openai" | "gemini" | null
  >(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaId>("hitesh");
  const [messageReactions, setMessageReactions] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [bookmarkedMessages, setBookmarkedMessages] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  const sequenceCounter = useRef(0);
  const { toast } = useToast();

  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    updateSession,
    deleteSession,
    getCurrentSession,
    clearAllSessions,
  } = useChatHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if API keys are stored in localStorage
    const storedOpenaiKey = localStorage.getItem("openai_api_key");
    const storedGeminiKey = localStorage.getItem("gemini_api_key");

    if (storedOpenaiKey || storedGeminiKey) {
      setOpenaiKey(storedOpenaiKey || "");
      setGeminiKey(storedGeminiKey || "");
      setShowApiKeyDialog(false);
    }

    // Load persona preference from localStorage
    const storedPersona = localStorage.getItem("selected_persona") as PersonaId;
    if (
      storedPersona &&
      (storedPersona === "hitesh" || storedPersona === "piyush")
    ) {
      setCurrentPersona(storedPersona);
    }

    // Load reactions and bookmarks from localStorage
    const storedReactions = localStorage.getItem("message_reactions");
    if (storedReactions) {
      try {
        setMessageReactions(JSON.parse(storedReactions));
      } catch (error) {
        console.error("Failed to load message reactions:", error);
      }
    }

    const storedBookmarks = localStorage.getItem("bookmarked_messages");
    if (storedBookmarks) {
      try {
        setBookmarkedMessages(new Set(JSON.parse(storedBookmarks)));
      } catch (error) {
        console.error("Failed to load bookmarked messages:", error);
      }
    }
  }, []);

  // Disable session loading for now to fix the core issue
  // useEffect(() => {
  //   const currentSession = getCurrentSession();
  //   if (currentSession) {
  //     setMessages(currentSession.messages);
  //   } else {
  //     setMessages([]);
  //   }
  // }, [currentSessionId]);

  // Save reactions to localStorage
  useEffect(() => {
    localStorage.setItem("message_reactions", JSON.stringify(messageReactions));
  }, [messageReactions]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem(
      "bookmarked_messages",
      JSON.stringify([...bookmarkedMessages])
    );
  }, [bookmarkedMessages]);

  const handleApiKeySubmit = (newOpenaiKey: string, newGeminiKey?: string) => {
    setOpenaiKey(newOpenaiKey);
    setGeminiKey(newGeminiKey || "");

    if (newOpenaiKey) localStorage.setItem("openai_api_key", newOpenaiKey);
    if (newGeminiKey) localStorage.setItem("gemini_api_key", newGeminiKey);

    setShowApiKeyDialog(false);

    const providerText =
      newOpenaiKey && newGeminiKey
        ? "both OpenAI and Gemini"
        : newOpenaiKey
        ? "OpenAI"
        : "Gemini";

    toast({
      title: "API Keys Saved",
      description: `You can now chat with Hitesh using ${providerText}!`,
    });
  };

  // Generate unique message ID
  const generateMessageId = (): string => {
    messageIdCounter.current += 1;
    return `msg_${Date.now()}_${messageIdCounter.current}`;
  };

  // Clean addMessage function
  const addMessage = (
    content: string,
    isUser: boolean,
    personaId?: PersonaId
  ): Message => {
    sequenceCounter.current += 1;
    const message: Message = {
      id: generateMessageId(),
      content,
      isUser,
      timestamp: new Date(),
      sequence: sequenceCounter.current,
      personaId: !isUser ? personaId || currentPersona : undefined, // Store persona only for AI messages
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    return message;
  };

  const handlePersonaChange = (personaId: PersonaId) => {
    setCurrentPersona(personaId);
    localStorage.setItem("selected_persona", personaId);

    toast({
      title: "AI Mentor Changed",
      description: `Switched to ${
        personaId === "hitesh" ? "Hitesh Choudhary" : "Piyush Garg"
      }. Your conversation continues with the new mentor.`,
    });
  };

  const handleNewChat = () => {
    messageIdCounter.current = 0;
    sequenceCounter.current = 0;
    setMessages([]);
    setShowSidebar(false);
  };

  const handleLoadChat = (sessionId: string) => {
    // Disabled for now
    // setCurrentSessionId(sessionId);
    setShowSidebar(false);
  };

  const handleMessageReaction = (messageId: string, reaction: string) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [reaction]: (prev[messageId]?.[reaction] || 0) + 1,
      },
    }));
  };

  const handleBookmarkMessage = (messageId: string) => {
    setBookmarkedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleMessageSelect = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("highlight-message");
      setTimeout(() => {
        messageElement.classList.remove("highlight-message");
      }, 2000);
    }
  };

  const handleClearCurrentChat = () => {
    if (currentSessionId) {
      deleteSession(currentSessionId);
      setMessages([]);
      toast({
        title: "Chat Cleared",
        description: "Current conversation has been cleared.",
      });
    }
  };

  const handleClearAllHistory = () => {
    clearAllSessions();
    setMessages([]);
    toast({
      title: "All History Cleared",
      description: "All chat history has been cleared.",
    });
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: () => setShowSidebar(!showSidebar),
    onNewChat: handleNewChat,
    onSearch: () => setShowSearch(true),
    onExport: () => setShowExport(true),
    onShowShortcuts: () => setShowShortcuts(true),
    onClearChat: handleClearCurrentChat,
    onClearAllHistory: handleClearAllHistory,
  });

  const handleSendMessage = async (messageText: string) => {
    if (!openaiKey && !geminiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    // Add user message using the addMessage function
    const userMessage = addMessage(messageText, true);
    setIsLoading(true);

    try {
      const result = await sendChatMessage(
        messageText,
        openaiKey,
        geminiKey,
        currentPersona
      );

      // Add AI message using the addMessage function with current persona
      addMessage(result.response, false, currentPersona);
      setLastUsedProvider(result.usedProvider);

      // Show notification if fallback was used
      if (result.usedProvider === "gemini" && openaiKey) {
        toast({
          title: "Using Gemini Fallback",
          description:
            "OpenAI quota exceeded, switched to Gemini automatically.",
        });
      }
    } catch (error) {
      console.error("Chat error:", error);

      let errorMessage = "Sorry, I couldn't process your message right now.";
      if (error instanceof Error) {
        if (
          error.message.includes("API key") ||
          error.message.includes("Both AI services")
        ) {
          errorMessage = error.message;
          setShowApiKeyDialog(true);
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-chat-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <ChatHeader
          currentPersona={currentPersona}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onToggleSearch={() => setShowSearch(true)}
          onToggleExport={() => setShowExport(true)}
          hasMessages={messages.length > 0}
        />

        {lastUsedProvider && (
          <div className="bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 text-center py-2 text-xs border-b border-border/30">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-muted-foreground">
                Powered by{" "}
                {lastUsedProvider === "openai"
                  ? "OpenAI GPT-4"
                  : "Google Gemini"}
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="animate-fade-in">
              <WelcomeMessage currentPersona={currentPersona} />
            </div>
          ) : (
            <div className="space-y-2 pb-8">
              {messages
                .sort((a, b) => a.sequence - b.sequence)
                .map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChatMessage
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                      messageId={message.id}
                      onReaction={handleMessageReaction}
                      onBookmark={handleBookmarkMessage}
                      reactions={messageReactions[message.id]}
                      isBookmarked={bookmarkedMessages.has(message.id)}
                      messagePersonaId={message.personaId}
                      currentPersona={currentPersona}
                    />
                  </div>
                ))}
              {isLoading && <TypingIndicator currentPersona={currentPersona} />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="relative">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentPersona={currentPersona}
            onPersonaChange={handlePersonaChange}
          />
        </div>

        <ApiKeyDialog
          open={showApiKeyDialog}
          onApiKeySubmit={handleApiKeySubmit}
        />

        {/* Sidebar */}
        <ChatSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          onNewChat={handleNewChat}
          onLoadChat={handleLoadChat}
        />

        {/* Search Modal */}
        <MessageSearch
          messages={messages}
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onMessageSelect={handleMessageSelect}
          currentPersona={currentPersona}
        />

        {/* Export Modal */}
        <ExportChat
          messages={messages}
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          currentPersona={currentPersona}
        />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcuts
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      </div>
    </div>
  );
};

export default Index;
