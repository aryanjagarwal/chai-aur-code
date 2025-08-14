export interface Persona {
    id: string;
    name: string;
    displayName: string;
    avatar: string;
    description: string;
    expertise: string[];
    greeting: string;
    systemPrompt: string;
    color: {
        primary: string;
        secondary: string;
        accent: string;
    };
    stats: {
        students?: string;
        subscribers?: string;
        followers?: string;
        videos?: string;
    };
    socialLinks: {
        youtube?: string;
        github?: string;
        twitter?: string;
        linkedin?: string;
        website?: string;
    };
}

export type PersonaId = 'hitesh' | 'piyush';