"use client";

import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import React, {
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { Button } from "./button";

interface CustomTextareaFormProps {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomTextareaForm: React.FC<
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> &
    CustomTextareaFormProps
> = ({ value, onChange, onSubmit, className, disabled, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault();
        const { selectionStart, selectionEnd } = event.currentTarget;
        const newValue =
          value.slice(0, selectionStart) + "\n" + value.slice(selectionEnd);
        onChange(newValue);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
        event.currentTarget.selectionStart = event.currentTarget.selectionEnd =
          selectionStart + 1;
      } else {
        event.preventDefault();
        onSubmit(event);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    adjustHeight();
  }, [value]);

  return (
    <form
      className="flex items-center justify-between h-auto w-full "
      onSubmit={handleSubmit}
    >
      <div className="w-full lg:max-w-4xl mx-auto flex items-end dark:ring-arsenic rounded-lg gap-2 focus-visible:ring-0 ring-1 ring-gray-200/60 bg-gray-200/50 focus-visible:border-none p-2.5">
        <textarea
          value={value}
          disabled={disabled}
          ref={textareaRef}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            "w-full px-5 py-2.5 bg-transparent outline-none focus-visible:ring-0 resize-none hidden-scrollbar placeholder:text-gray-400  rounded-2xl max-h-52 hide-scrollbar pl-4 text-sm",
            className
          )}
          {...rest}
        />
        <Button type="submit" size="icon" disabled={value.length === 0}>
          <SendHorizonal className="w-10 h-10" />
        </Button>
      </div>
    </form>
  );
};

export default CustomTextareaForm;
