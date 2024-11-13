"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  onContinue: () => void;
}

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  onContinue,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    en: "English",
    pg: "Pidgin",
    hr: "Hausa",
    yr: "Yoruba",
    ig: "Igbo",
  };

  const handleLanguageSelect = (value: string) => {
    setSelectedLanguage(value);
    setIsOpen(false); // Close the Select popover
  };

  return (
    <div className="text-center relative w-full h-screen">
      <div className="mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Choose your language
        </h2>
        <p className="text-[18px] font-medium text-[#434343]">
          Select your preferred language to continue
        </p>
      </div>

      <Select open={isOpen} onOpenChange={setIsOpen} value={selectedLanguage}>
        <div className="mt-6 flex justify-start">
          <Label htmlFor="terms" className=" text-xl">
            Language
          </Label>
        </div>
        {/* <SelectLabel>Languages</SelectLabel> */}
        <SelectTrigger id="terms" className="w-full mt-[8px]">
          <SelectValue placeholder="Select a language">
            {selectedLanguage
              ? languages[selectedLanguage as keyof typeof languages]
              : "Select a language"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[92%] p-5">
          <SelectGroup>
            <div className="w-[89%]">
              <RadioGroup
                className=""
                value={selectedLanguage}
                onValueChange={handleLanguageSelect}
              >
                {Object.entries(languages).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-4 py-2">
                    <RadioGroupItem
                      className="text-[40px]"
                      value={value}
                      id={value}
                    />
                    <Label className="text-[18px]" htmlFor={value}>
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="absolute bottom-0 mb-32 w-full">
        <Button
          className={` ${
            !selectedLanguage
              ? "opacity-80 cursor-not-allowed hover:bg-none"
              : "bg-theme-primary hover:bg-[#0c2941]"
          } mt-[48px] bottom-0 text-[18px] font-medium text-[#FAFAFA] w-full py-[24px]`}
          onClick={onContinue}
          disabled={!selectedLanguage}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;
