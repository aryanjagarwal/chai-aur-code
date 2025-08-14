import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Plus,
    Search,
    Trash2,
    Edit3,
    Code,
    MessageSquare,
    Lightbulb,
    Zap,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MessageTemplate {
    id: string;
    title: string;
    content: string;
    category: 'code' | 'question' | 'learning' | 'general';
    tags: string[];
    createdAt: Date;
    usageCount: number;
}

interface MessageTemplatesProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (content: string) => void;
}

const MessageTemplates = ({ isOpen, onClose, onSelectTemplate }: MessageTemplatesProps) => {
    const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
        const saved = localStorage.getItem('message_templates');
        if (saved) {
            try {
                return JSON.parse(saved).map((t: any) => ({
                    ...t,
                    createdAt: new Date(t.createdAt)
                }));
            } catch {
                return getDefaultTemplates();
            }
        }
        return getDefaultTemplates();
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        content: '',
        category: 'general' as MessageTemplate['category'],
        tags: ''
    });

    const { toast } = useToast();

    function getDefaultTemplates(): MessageTemplate[] {
        return [
            {
                id: '1',
                title: 'React Component Help',
                content: 'Can you help me create a React component that [describe functionality]? Please include TypeScript types and proper error handling.',
                category: 'code',
                tags: ['react', 'typescript', 'component'],
                createdAt: new Date(),
                usageCount: 0
            },
            {
                id: '2',
                title: 'JavaScript Function',
                content: 'Write a JavaScript function that [describe what it should do]. Please include comments and handle edge cases.',
                category: 'code',
                tags: ['javascript', 'function'],
                createdAt: new Date(),
                usageCount: 0
            },
            {
                id: '3',
                title: 'Learning Path Question',
                content: 'I want to learn [technology/concept]. What would be the best learning path and resources you recommend?',
                category: 'learning',
                tags: ['learning', 'roadmap'],
                createdAt: new Date(),
                usageCount: 0
            },
            {
                id: '4',
                title: 'Code Review Request',
                content: 'Can you review this code and suggest improvements?\n\n```javascript\n// Paste your code here\n```',
                category: 'code',
                tags: ['review', 'improvement'],
                createdAt: new Date(),
                usageCount: 0
            },
            {
                id: '5',
                title: 'Interview Preparation',
                content: 'Help me prepare for [type] interview questions. Can you give me some common questions and how to approach them?',
                category: 'learning',
                tags: ['interview', 'preparation'],
                createdAt: new Date(),
                usageCount: 0
            }
        ];
    }

    const saveTemplates = (newTemplates: MessageTemplate[]) => {
        setTemplates(newTemplates);
        localStorage.setItem('message_templates', JSON.stringify(newTemplates));
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleSelectTemplate = (template: MessageTemplate) => {
        onSelectTemplate(template.content);

        // Increment usage count
        const updatedTemplates = templates.map(t =>
            t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
        );
        saveTemplates(updatedTemplates);

        onClose();
        toast({
            title: "Template Applied",
            description: `"${template.title}" has been added to your message.`,
        });
    };

    const handleCreateTemplate = () => {
        if (!newTemplate.title.trim() || !newTemplate.content.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide both title and content for the template.",
                variant: "destructive",
            });
            return;
        }

        const template: MessageTemplate = {
            id: Date.now().toString(),
            title: newTemplate.title.trim(),
            content: newTemplate.content.trim(),
            category: newTemplate.category,
            tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            createdAt: new Date(),
            usageCount: 0
        };

        saveTemplates([...templates, template]);
        setNewTemplate({ title: '', content: '', category: 'general', tags: '' });
        setShowCreateForm(false);

        toast({
            title: "Template Created",
            description: `"${template.title}" has been saved to your templates.`,
        });
    };

    const handleDeleteTemplate = (templateId: string) => {
        const updatedTemplates = templates.filter(t => t.id !== templateId);
        saveTemplates(updatedTemplates);

        toast({
            title: "Template Deleted",
            description: "Template has been removed from your collection.",
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'code': return <Code className="w-4 h-4" />;
            case 'question': return <MessageSquare className="w-4 h-4" />;
            case 'learning': return <Lightbulb className="w-4 h-4" />;
            default: return <Zap className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'code': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
            case 'question': return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20';
            case 'learning': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
            default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95vw] h-[80vh] p-0 gap-0">
                <DialogHeader className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <DialogTitle>Message Templates</DialogTitle>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateForm(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Template
                        </Button>
                    </div>
                    <DialogDescription>
                        Save and reuse common messages to speed up your conversations with Hitesh.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-border p-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Category</Label>
                            <div className="space-y-1">
                                {['all', 'code', 'question', 'learning', 'general'].map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className="w-full justify-start h-8"
                                    >
                                        {category !== 'all' && getCategoryIcon(category)}
                                        <span className="ml-2 capitalize">{category}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        {showCreateForm ? (
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Create New Template</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={newTemplate.title}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Template title..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea
                                            id="content"
                                            value={newTemplate.content}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                            placeholder="Template content..."
                                            className="min-h-[120px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <select
                                                id="category"
                                                value={newTemplate.category}
                                                onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as MessageTemplate['category'] }))}
                                                className="w-full h-9 px-3 rounded-md border border-border bg-background"
                                            >
                                                <option value="general">General</option>
                                                <option value="code">Code</option>
                                                <option value="question">Question</option>
                                                <option value="learning">Learning</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                                            <Input
                                                id="tags"
                                                value={newTemplate.tags}
                                                onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                                                placeholder="react, javascript, help"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={handleCreateTemplate}>
                                            Create Template
                                        </Button>
                                        <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <ScrollArea className="flex-1">
                                <div className="p-6">
                                    <div className="mb-4 text-sm text-muted-foreground">
                                        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                                    </div>

                                    <div className="space-y-3">
                                        {filteredTemplates.map((template) => (
                                            <div
                                                key={template.id}
                                                className="group p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer"
                                                onClick={() => handleSelectTemplate(template)}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-foreground">{template.title}</h4>
                                                        <Badge variant="outline" className={cn("text-xs", getCategoryColor(template.category))}>
                                                            {getCategoryIcon(template.category)}
                                                            <span className="ml-1 capitalize">{template.category}</span>
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTemplate(template.id);
                                                            }}
                                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                    {template.content}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {template.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        Used {template.usageCount} times
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MessageTemplates;