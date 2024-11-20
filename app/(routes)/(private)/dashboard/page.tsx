"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { Home, Wallet, MessageSquare, Menu, MoveLeft, Router } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useUserInfo from "@/hooks/use-userinfo";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, ClockIcon } from 'lucide-react'
import { Button } from "@/components/ui/button";

const features = [
  {
    image: "/arrow-up-down.svg",
    title: "Transfer",
    url: "/transfer",
  },
  {
    image: "/globe-02.svg",
    title: "Buy Data",
    url: "/buy-data",
  },
  {
    image: "/invoice-01.svg",
    title: "Buy Airtime",
    url: "/airtime",
  },
  {
    image: "/coins-01.svg",
    title: "Get Loans",
    url: "/loan",
  },
];

const transactions = [
  {
    amount: 100000,
    sender: "JOHN DOE SUPER STORES",
    status: false,
  },
  {
    amount: 100000,
    sender: "TRF FRM ESTHER DANIEL TO JOHN DOE",
    status: true,
  },
  {
    amount: 50000,
    sender: "WITHDRAWAL ATM",
    status: false,
  },
  {
    amount: 75000,
    sender: "ONLINE PURCHASE",
    status: false,
  },
  {
    amount: 200000,
    sender: "SALARY CREDIT",
    status: true,
  },
];

const DashboardView = () => {
  const router = useRouter();
  const { info } = useUserInfo();

  const navigateToKyc = () => {
    router.push("/kyc");
    console.log("navigate to kyc");
  };
  return (
    <div className="mt-[48px]  mb-[10rem] h-auto  h[calc(100vh-100px)] overflow-y-auto">
      {info?.isVerified === false && (
        <div className="mb-5">
          <Card className=" shadow-none">
            <CardHeader>
              <CardTitle className="border-b pb-[10px]">
                Verify Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To ensure the security of your account and enable full access to
                EchoPay&apos;s features, please complete the verification
                process
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={navigateToKyc}
                size="lg"
                className="text-[18px] py-[24px] font-medium bg-[#003056] hover:bg-[#0c2941] text-[#FAFAFA] w-full"
              >
                Verify
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <Link
        href="/chat"
        className="h-[224px] rounded-[8px] bg-[#D1DCE5] p-4 flex flex-col justify-between"
      >
        <div className=" h-[48px] rounded-full mt-[35px] flex justify-center items-center">
          <Image
            className="w-[68px] h-[68px] -rotate-[35deg]"
            src="/mic-01.svg"
            alt="mic"
            width={32}
            height={32}
          />
          <Image
            className="w-[68px] h-[68px]"
            src="/chatting.svg"
            alt="mic"
            width={32}
            height={32}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className=" text-[18px] text-[#1A1A1A] font-medium">Echo Ai</p>
          <Image
            className="w-[6px] h-[12px]"
            src="/right.svg"
            width={6}
            height={12}
            alt="icon"
          />
        </div>
      </Link>
    </div>
  );
};

const TransactionView = () => (

  <div className="mt-[48px] justify-between mb-10">
    <div className="flex justify-between items-center">
      <MoveLeft className="w-[24px] h-[24px] cursor-pointer text-[#003056]" />
    <h2>Transction history</h2>
    <Image
                src="/notification.svg"
                width={24}
                height={24}
                alt="notification icon"
              />
    </div>
    <div className="">
      
    </div>

    <div className="mt-[48px]">
      <div>
        <div className="flex justify-between items-center">
          <p className="text-[#1A1A1A] font-medium">Recent Transactions</p>
          <p className="text-[#737373] font-medium">See all</p>
        </div>
        <p className="text-[#737373] font-medium mt-[8px]">
          07 NOV 2024, THURSDAY
        </p>
      </div>
      <div>
        {transactions.map((transac, index) => (
          <ul key={index} className="mt-[10px]">
            <li className="flex justify-between items-center mt-3">
              <p className="font-medium">{transac.sender}</p>
              <p
                className={`${
                  transac.status && "text-green-500 font-medium"
                } text-red-500`}
              >
                N{transac.amount}
              </p>
            </li>
          </ul>
        ))}
      </div>
    </div>
  </div>

);

const AiView = () => (
  <div className="space-y-6 m-4 relative mb-10 flex flex-col justify-between">
    <div className=" flex justify-between items-center gap-4">
      <Image
        src="/ai.svg"
        alt="icon"
        className="w-[62px] h-[63px]"
        width={62}
        height={62}
      />
      <p className="text-[32px] font-medium text-[#1A1A1A]">
        What can i do for you?
      </p>
    </div>
    <div>
      <div className="my-5">
        <div className="flex justify-end items-center">
          <Image
            className="h-[40px] float-right w-[40px] bg-[#003056] rounded-full"
            src="/avater.png"
            alt="avater"
            width={12}
            height={12}
          />
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur,
          maiores.
        </p>
      </div>
      <div className="my-5">
        <div className="flex justify-start items-center">
          <Image
            className="h-[40px] float-right w-[40px] bg-[#003056] rounded-full"
            src="/ai.svg"
            alt="avater"
            width={12}
            height={12}
          />
        </div>
        <p className=" text-right">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur,
          maiores.
        </p>
      </div>
    </div>
    <div className="  bottom-0 mt-28">
      <Input type="text" placeholder="Type here" />
    </div>
  </div>
);

const MoreView = () => (
  <div className="space-y-6 mt-4 mb-10">
    <h2 className="text-2xl font-semibold">More Options</h2>
    <ul className="space-y-4">
      <li className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
        <span>Settings</span>
        <Image
          className="w-[6px] h-[12px]"
          src="/right.svg"
          width={6}
          height={12}
          alt="icon"
        />
      </li>
      <li className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
        <span>Help & Support</span>
        <Image
          className="w-[6px] h-[12px]"
          src="/right.svg"
          width={6}
          height={12}
          alt="icon"
        />
      </li>
      <li className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
        <span>About Us</span>
        <Image
          className="w-[6px] h-[12px]"
          src="/right.svg"
          width={6}
          height={12}
          alt="icon"
        />
      </li>
    </ul>
  </div>
);

const DashboardPage = () => {
  const [activeView, setActiveView] = useState("home");
  // const [showPopup, setShowPopup] = useState(true);

  const { info } = useUserInfo();

  const router = useRouter();
  console.log(info)


  useEffect(() => {
    router.push(`/dashboard/${activeView}`);
  }, [activeView, router]);

  // const isVerified = info?.isVerified

  // useEffect(() => {
  //   // Simulating first visit check
  //   if (info && isVerified === false) {
  //     setShowPopup(true);
  //   }
  // }, [info, isVerified]);

  // const handleVerify = () => {
  //   // Handle verification logic here
  //   setShowPopup(false);
  // };

  return (
    <div className="w-full border-2 border-red-500 relative h-screen flex flex-col max-w-md mx-auto p-6 pb-10 md:pb-0">
      <div className="flex-1 overflow-y-auto">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex md:w-1/2 gap-[16px] items-center">
              <div className="bg-[#003056] rounded-full w-[40px] cursor-pointer h-[40px] flex items-center justify-center text-white font-medium text-lg">
                {info?.email ? info.email.charAt(0).toUpperCase() : "U"}
              </div>

              <div>
                <p className="text-[#434343]">Good morning</p>
                <p className="text-[#1A1A1A] font-medium text-[20px]">
                  {info?.phone}
                </p>
              </div>
            </div>
            <div>
              <Image
                src="/notification.svg"
                width={24}
                height={24}
                alt="notification icon"
              />
            </div>
          </div>

          {activeView === "home" && (
            <div className="h-[111px] border-2 border-red-500 w-full text-white mt-[60px] flex p-4 justify-between rounded-[8px] bg-[#003056]">
            <div className="flex flex-col justify-between">
              <p className="">Balance</p>
              <p className="text-[22px] md:text-[24px] font-semibold">
                N {info?.balance}
              </p>
            </div>
            <div className="relative flex flex-col justify-end w-1/2">
              <Image
                className="absolute h-[80px] w-[74px] -top-4 -right-4"
                src="/echo.svg"
                width={0}
                height={0}
                alt="logo"
              />
              <div className="flex justify-end">
                <Image
                  className=" h-[20px] mb-1 w-[20px]"
                  src="/eye.svg"
                  width={20}
                  height={14}
                  alt="eye icon"
                />
              </div>
            </div>
          </div>
          )} 

        </div>

        {activeView === "home" && (
          <div className="w-full h-[90px] flex justify-evenly mt-[34px]">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col justify-between">
                <div className="flex justify-center rounded-[8px] mb-[8px] items-center p-2 bg-[#FAFAFA] h-[64px]">
                  <Link href={feature.url}>
                    <Image
                      className=" h-[24px] w-[24px]"
                      src={feature.image}
                      alt={feature.title}
                      width={12}
                      height={12}
                    />
                  </Link>
                </div>
                <p className="text-[14px] font-medium text-[#1A1A1A]">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeView === "home" && <DashboardView />}
        {activeView === "transaction" && <TransactionView />}
        {activeView === "ai" && <AiView />}
        {activeView === "more" && <MoreView />}

        <nav className="absolute w-[88%] mx-auto bottom-0 left-0 right-0 min-w-0 bg-white border-t border-gray-200 pb-5 lg:pb-0">
          <div className="maxw-md mxauto flex justify-around min-w-0 items-center h-16">
            <button
              onClick={() => {setActiveView("home"); router.push("/dashoard/home")}}
              className={`flex flex-col items-center ${
                activeView === "home" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => {setActiveView("transaction"); router.push("/dashboard/transaction")}}
              className={`flex flex-col items-center ${
                activeView === "wallet" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <Wallet size={24} />
              <span className="text-xs mt-1">Transaction</span>
            </button>
            <button
              onClick={() => {setActiveView("ai"); router.push("/dashoard/ai")}}
              className={`flex flex-col items-center ${
                activeView === "ai" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <MessageSquare size={24} />
              <span className="text-xs mt-1">Ai</span>
            </button>
            <button
              onClick={() => {setActiveView("more"); router.push("/dashoard/more")}}
              className={`flex flex-col items-center ${
                activeView === "more" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <Menu size={24} />
              <span className="text-xs mt-1">More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashboardPage;
