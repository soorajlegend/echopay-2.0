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
  setValue: (newValue: string) => void;
  onSubmit: () => Promise<void>;
  isVisible?: boolean;
  className?: string;
  disabled?: boolean;
}

const CustomTextareaForm: React.FC<
  CustomTextareaFormProps & TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({
  value,
  setValue,
  onSubmit,
  isVisible,
  className,
  disabled,
  ...rest
}) => {
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
        setValue(newValue);
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
  }, [value, isVisible]);

  return (
    <form
      className="flex items-center justify-between h-auto w-full "
      onSubmit={handleSubmit}
    >
      <div className="w-full lg:max-w-4xl mx-auto flex items-end  dark:ring-arsenic p-1 rounded-full gap-2">
        <textarea
          value={value}
          disabled={disabled}
          ref={textareaRef}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            "w-full p-2 outline-none focus-visible:ring-0 ring-1 ring-gray-200/60 bg-gray-200/50 focus-visible:border-none resize-none hidden-scrollbar placeholder:text-gray-400  rounded-2xl max-h-52 hide-scrollbar pl-4 text-sm",
            className
          )}
          {...rest}
        />
      </div>
    </form>
  );
};

export default CustomTextareaForm;
