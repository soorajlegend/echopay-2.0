"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Recorder from "./_components/recorder";

const VoicePage = () => {
  return (
    <div className="relative flex flex-col w-full h-screen p-4 pt-0">
      <div className="flex items-center justify-between sticky top-0 z-50 bg-white px-4 py-2">
        <Link href="/chat" className="flex items-center">
          <ChevronLeft className="w-10 h-10 p-1.5" />
          <h2 className="text-base lg:text-lg font-semibold">Voice Message</h2>
        </Link>
      </div>
      <Recorder />
    </div>
  );
};

export default VoicePage;
