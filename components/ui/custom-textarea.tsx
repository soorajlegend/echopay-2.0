"use client";

import { cn } from "@/lib/utils";
import React, {
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";

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
    <form className="w-full" onSubmit={handleSubmit}>
      <textarea
        value={value}
        disabled={disabled}
        ref={textareaRef}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className={cn("w-full resize-none outline-none", className)}
        {...rest}
      />
    </form>
  );
};

export default CustomTextareaForm;
