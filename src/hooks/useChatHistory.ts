import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export const useChatHistory = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // Load sessions from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('chat_sessions');
        if (savedSessions) {
            try {
                const parsed = JSON.parse(savedSessions);
                const sessionsWithDates = parsed.map((session: any) => ({
                    ...session,
                    createdAt: new Date(session.createdAt),
                    updatedAt: new Date(session.updatedAt),
                    messages: session.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
                setSessions(sessionsWithDates);
            } catch (error) {
                console.error('Failed to load chat sessions:', error);
            }
        }
    }, []);

    // Save sessions to localStorage whenever sessions change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('chat_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    const createNewSession = (title?: string): string => {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: title || `Chat ${sessions.length + 1}`,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        return newSession.id;
    };

    const updateSession = (sessionId: string, messages: Message[]) => {
        setSessions(prev => prev.map(session =>
            session.id === sessionId
                ? {
                    ...session,
                    messages,
                    updatedAt: new Date(),
                    title: session.title === `Chat ${sessions.length}` && messages.length > 0
                        ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '')
                        : session.title
                }
                : session
        ));
    };

    const deleteSession = (sessionId: string) => {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        if (currentSessionId === sessionId) {
            setCurrentSessionId(null);
        }
    };

    const getCurrentSession = (): ChatSession | null => {
        return sessions.find(session => session.id === currentSessionId) || null;
    };

    const clearAllSessions = () => {
        setSessions([]);
        setCurrentSessionId(null);
        localStorage.removeItem('chat_sessions');
    };

    return {
        sessions,
        currentSessionId,
        setCurrentSessionId,
        createNewSession,
        updateSession,
        deleteSession,
        getCurrentSession,
        clearAllSessions
    };
};