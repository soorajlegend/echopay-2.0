"use client";
import React from "react";
import {
  MoveLeft,
  User,
  HelpCircle,
  Share2,
  ChevronRight,
  Power,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useUserInfo from "@/hooks/use-userinfo";

const sections = [
  {
    title: "Account",
    icon: <User size={24} className="text-[#003056]" />,
    links: [
      { title: "Beneficiary Management", url: "/beneficiary" },
      { title: "Card Management", url: "/security" },
      { title: "Loans & Investments", url: "/preferences" },
      { title: "Generate Statement", url: "/statement" },
    ],
  },
  {
    title: "Support",
    icon: <HelpCircle size={24} className="text-[#003056]" />,
    links: [
      { title: "Livechat", url: "/chat" },
      { title: "Report an Issue", url: "/report-issue" },
      { title: "Call Us", url: "/call-us" },
      { title: "Mail Us", url: "/mail-us" },
    ],
  },
  {
    title: "logout",
    icon: <User size={24} className="text-[#003056]" />,
    links: [{ title: "logout", url: "/logout" }],
  },
  {
    title: "Social Media",
    icon: <Share2 size={24} className="text-[#003056]" />,
    links: [
      { title: "Facebook", url: "https://facebook.com" },
      { title: "Twitter", url: "https://twitter.com" },
      { title: "Instagram", url: "https://instagram.com" },
    ],
  },
];

const Page = () => {
  const router = useRouter();
  const { setInfo } = useUserInfo();

  const handleLogOut = () => {
    setInfo(null);
    router.push("/");
  };

  return (
    <div className="overflow-y-auto h-full p-5 justify-between mb-10">
      <div className=" p-0">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <MoveLeft
              onClick={() => router.back()}
              className="w-[24px] h-[24px] cursor-pointer text-[#003056]"
            />
            <h2>More</h2>
          </div>
          <Button size="icon" variant="destructive" onClick={handleLogOut}>
            <Power className="w-8 h-8" />
          </Button>
        </div>

        {sections.map((section, index) => (
          <Card key={index} className="shadow-none border-none p-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[18px] font-medium text-[#1A1A1A]">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.url}
                      className="flex justify-between items-center text-[16px] text-[#434343] my-[16px] py-2"
                    >
                      {link.title}
                      <ChevronRight size={20} className="text-[#003056]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
