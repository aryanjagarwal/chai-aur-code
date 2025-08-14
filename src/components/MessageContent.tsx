import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

const MessageContent = ({ content, isUser }: MessageContentProps) => {
  // Don't parse user messages for code blocks
  if (isUser) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed m-0 font-medium text-primary-foreground">
        {content}
      </p>
    );
  }

  // Parse inline code first, then code blocks
  const parseInlineCode = (text: string) => {
    const parts = [];
    const inlineCodeRegex = /`([^`\n]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add inline code
      parts.push(
        <InlineCode key={`inline-${match.index}`}>
          {match[1]}
        </InlineCode>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 1 ? parts : text;
  };

  // Parse AI messages for code blocks
  const parseContent = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    
    // Regex to match code blocks with optional language and filename
    const codeBlockRegex = /```(\w+)?\s*(?:\n.*?filename:\s*(.+?)\n)?([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block (with inline code parsing)
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          const parsedText = parseInlineCode(textBefore);
          parts.push(
            <div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed m-0 text-foreground">
                {parsedText}
              </p>
            </div>
          );
        }
      }

      // Add code block
      const language = match[1] || 'text';
      const filename = match[2];
      const code = match[3].trim();
      
      parts.push(
        <CodeBlock
          key={`code-${match.index}`}
          code={code}
          language={language}
          filename={filename}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block (with inline code parsing)
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        const parsedText = parseInlineCode(remainingText);
        parts.push(
          <div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-relaxed m-0 text-foreground">
              {parsedText}
            </p>
          </div>
        );
      }
    }

    // If no code blocks found, parse for inline code only
    if (parts.length === 0) {
      const parsedText = parseInlineCode(text);
      return (
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm leading-relaxed m-0 text-foreground">
            {parsedText}
          </p>
        </div>
      );
    }

    return <div className="space-y-3">{parts}</div>;
  };

  return parseContent(content);
};

export default MessageContent;