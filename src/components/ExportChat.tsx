import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  FileText,
  Code,
  Image,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { Message } from "@/types/chat";
import { PersonaId } from "@/types/persona";
import { getPersonaById } from "@/data/personas";
import { useToast } from "@/hooks/use-toast";

interface ExportChatProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  currentPersona?: PersonaId;
}

type ExportFormat = "txt" | "md" | "json" | "html";

const ExportChat = ({
  messages,
  isOpen,
  onClose,
  currentPersona = "hitesh",
}: ExportChatProps) => {
  const [format, setFormat] = useState<ExportFormat>("md");
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeCodeBlocks, setIncludeCodeBlocks] = useState(true);
  const [userMessagesOnly, setUserMessagesOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Helper function to get persona name for each message
  const getPersonaName = (message: Message): string => {
    if (message.isUser) return "You";
    const messagePersona = message.personaId || currentPersona;
    const persona = getPersonaById(messagePersona);
    return persona?.displayName || "AI Assistant";
  };

  // Get current persona for titles and filenames
  const getCurrentPersonaName = (): string => {
    const persona = getPersonaById(currentPersona);
    return persona?.displayName || "AI Assistant";
  };

  const formatMessages = (format: ExportFormat) => {
    const filteredMessages = userMessagesOnly
      ? messages.filter((msg) => msg.isUser)
      : messages;

    switch (format) {
      case "txt":
        return filteredMessages
          .map((msg) => {
            const timestamp = includeTimestamps
              ? `[${msg.timestamp.toLocaleString()}] `
              : "";
            const sender = getPersonaName(msg);
            let content = msg.content;

            if (!includeCodeBlocks) {
              content = content.replace(
                /```[\s\S]*?```/g,
                "[Code Block Removed]"
              );
              content = content.replace(/`[^`]+`/g, "[Code Removed]");
            }

            return `${timestamp}${sender}: ${content}`;
          })
          .join("\n\n");

      case "md":
        return filteredMessages
          .map((msg) => {
            const timestamp = includeTimestamps
              ? `*${msg.timestamp.toLocaleString()}*\n`
              : "";
            const sender = msg.isUser
              ? "**You**"
              : `**${getPersonaName(msg)}**`;
            let content = msg.content;

            if (!includeCodeBlocks) {
              content = content.replace(
                /```[\s\S]*?```/g,
                "*[Code Block Removed]*"
              );
              content = content.replace(/`[^`]+`/g, "*[Code Removed]*");
            }

            return `${timestamp}${sender}:\n${content}`;
          })
          .join("\n\n---\n\n");

      case "json":
        return JSON.stringify(
          filteredMessages.map((msg) => ({
            id: msg.id,
            sender: msg.isUser ? "user" : "assistant",
            content: includeCodeBlocks
              ? msg.content
              : msg.content.replace(/```[\s\S]*?```/g, "[Code Block Removed]"),
            timestamp: includeTimestamps
              ? msg.timestamp.toISOString()
              : undefined,
          })),
          null,
          2
        );

      case "html":
        const htmlMessages = filteredMessages
          .map((msg) => {
            const timestamp = includeTimestamps
              ? `<small class="timestamp">${msg.timestamp.toLocaleString()}</small>`
              : "";
            const sender = getPersonaName(msg);
            const senderClass = msg.isUser ? "user" : "assistant";
            let content = msg.content;

            if (!includeCodeBlocks) {
              content = content.replace(
                /```[\s\S]*?```/g,
                "<em>[Code Block Removed]</em>"
              );
              content = content.replace(/`[^`]+`/g, "<em>[Code Removed]</em>");
            } else {
              // Basic markdown to HTML conversion for code blocks
              content = content.replace(
                /```(\w+)?\n([\s\S]*?)```/g,
                '<pre><code class="language-$1">$2</code></pre>'
              );
              content = content.replace(/`([^`]+)`/g, "<code>$1</code>");
            }

            // Convert line breaks to HTML
            content = content.replace(/\n/g, "<br>");

            return `
            <div class="message ${senderClass}">
              ${timestamp}
              <div class="sender">${sender}:</div>
              <div class="content">${content}</div>
            </div>
          `;
          })
          .join("\n");

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Export - {getCurrentPersonaName()} AI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
        .message.user { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; }
        .message.assistant { background-color: #f9fafb; border-left: 4px solid #10b981; }
        .sender { font-weight: bold; margin-bottom: 5px; }
        .timestamp { color: #6b7280; font-size: 0.875rem; }
        code { background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: 'Monaco', 'Consolas', monospace; }
        pre { background-color: #1f2937; color: #f9fafb; padding: 15px; border-radius: 8px; overflow-x: auto; }
        pre code { background: none; padding: 0; }
    </style>
</head>
<body>
    <h1>Chat Export - {getCurrentPersonaName()} AI</h1>
    <p>Exported on ${new Date().toLocaleString()}</p>
    ${htmlMessages}
</body>
</html>
        `;

      default:
        return "";
    }
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const content = formatMessages(format);
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${currentPersona}-chat-${timestamp}.${format}`;

    const mimeTypes = {
      txt: "text/plain",
      md: "text/markdown",
      json: "application/json",
      html: "text/html",
    };

    downloadFile(content, filename, mimeTypes[format]);

    toast({
      title: "Chat Exported",
      description: `Your chat has been exported as ${filename}`,
    });

    onClose();
  };

  const copyToClipboard = async () => {
    const content = formatMessages(format);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Chat content has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareChat = async () => {
    const content = formatMessages("txt");
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chat with ${getCurrentPersonaName()} AI`,
          text: content,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Chat
          </DialogTitle>
          <DialogDescription>
            Export your conversation with {getCurrentPersonaName()} AI in
            various formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="md" id="md" />
                <Label
                  htmlFor="md"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Markdown (.md) - Best for documentation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="txt" id="txt" />
                <Label
                  htmlFor="txt"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Plain Text (.txt) - Simple format
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="html" id="html" />
                <Label
                  htmlFor="html"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Image className="w-4 h-4" />
                  HTML (.html) - Styled webpage
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label
                  htmlFor="json"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                  JSON (.json) - Structured data
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamps"
                  checked={includeTimestamps}
                  onCheckedChange={(checked) =>
                    setIncludeTimestamps(checked === true)
                  }
                />
                <Label htmlFor="timestamps" className="text-sm cursor-pointer">
                  Include timestamps
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="codeblocks"
                  checked={includeCodeBlocks}
                  onCheckedChange={(checked) =>
                    setIncludeCodeBlocks(checked === true)
                  }
                />
                <Label htmlFor="codeblocks" className="text-sm cursor-pointer">
                  Include code blocks
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useronly"
                  checked={userMessagesOnly}
                  onCheckedChange={(checked) =>
                    setUserMessagesOnly(checked === true)
                  }
                />
                <Label htmlFor="useronly" className="text-sm cursor-pointer">
                  User messages only
                </Label>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Total messages:</span>
              <span>
                {userMessagesOnly
                  ? messages.filter((m) => m.isUser).length
                  : messages.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Date range:</span>
              <span>
                {messages.length > 0 &&
                  `${messages[
                    messages.length - 1
                  ].timestamp.toLocaleDateString()} - ${messages[0].timestamp.toLocaleDateString()}`}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            onClick={shareChat}
            className="w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportChat;
