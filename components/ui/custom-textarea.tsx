"use client";

import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import React, {
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button } from "./button";

interface CustomTextareaFormProps {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export interface CustomTextareaFormRef {
  focus: () => void;
}

const CustomTextareaForm = forwardRef<
  CustomTextareaFormRef,
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> &
    CustomTextareaFormProps
>(
  (
    { value, onChange, onSubmit, className, disabled, autoFocus, ...rest },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

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
          event.currentTarget.selectionStart =
            event.currentTarget.selectionEnd = selectionStart + 1;
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
      if (autoFocus && textareaRef.current) {
        textareaRef.current.focus();
      }
      adjustHeight();
    }, [value, autoFocus]);

    return (
      <form
        className="flex items-center justify-between h-auto w-full "
        onSubmit={handleSubmit}
      >
        <div className="w-full lg:max-w-4xl mx-auto flex items-end dark:ring-arsenic rounded-full gap-2 focus-visible:ring-0 ring-1 ring-gray-200/60 bg-gray-200/50 focus-visible:border-none p-2 mb-5 lg:mb-0">
          <textarea
            value={value}
            disabled={disabled}
            ref={textareaRef}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className={cn(
              "w-full py-1 px-2 bg-transparent outline-none focus-visible:ring-0 resize-none hidden-scrollbar placeholder:text-gray-400 max-h-52 hide-scrollbar text-sm caret-theme-primary",
              className
            )}
            {...rest}
          />
          <Button
            type="submit"
            size="icon"
            disabled={value.length === 0}
            className="w-8 h-8 rounded-full"
          >
            <SendHorizonal />
          </Button>
        </div>
      </form>
    );
  }
);

CustomTextareaForm.displayName = "CustomTextareaForm";

export default CustomTextareaForm;
