import { cn } from "@/lib/utils";

interface InlineCodeProps {
  children: string;
  className?: string;
}

const InlineCode = ({ children, className }: InlineCodeProps) => {
  return (
    <code className={cn(
      "px-2 py-1 rounded-md bg-muted/60 border border-border/50 text-sm font-mono text-foreground",
      "hover:bg-muted/80 transition-colors duration-200",
      className
    )}>
      {children}
    </code>
  );
};

export default InlineCode;