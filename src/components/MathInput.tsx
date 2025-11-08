import { useEffect, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

interface MathInputProps {
  value: string;
  onChange: (latex: string) => void;
  placeholder?: string;
}

export const MathInput = ({ value, onChange, placeholder }: MathInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    if (displayRef.current) {
      try {
        katex.render(value || placeholder || "", displayRef.current, {
          displayMode: false,
          throwOnError: false,
          strict: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
      }
    }
  }, [value, placeholder]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const insertAtCursor = (text: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const newValue = value.slice(0, start) + text + value.slice(end);
      onChange(newValue);
      
      setTimeout(() => {
        if (inputRef.current) {
          const newPos = start + text.length;
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newPos, newPos);
          setCursorPosition(newPos);
        }
      }, 0);
    }
  };

  // Expose insert function via ref
  useEffect(() => {
    (inputRef.current as any)?.setAttribute('data-insert', 'ready');
  }, []);

  return (
    <div className="space-y-2">
      <div 
        ref={displayRef}
        className="border border-input rounded-md bg-muted/30 p-3 min-h-[42px] overflow-x-auto"
      />
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
        onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart)}
        placeholder={placeholder}
        className="w-full border border-input rounded-md bg-background p-2 text-sm font-mono resize-none"
        rows={2}
      />
    </div>
  );
};
