"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Home, Wallet, X, MessageSquare, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const features = [
  {
    image: "/arrow-up-down.svg",
    title: "Transfer",
  },
  {
    image: "/globe-02.svg",
    title: "Buy Data",
  },
  {
    image: "/invoice-01.svg",
    title: "Buy Airtime",
  },
  {
    image: "/coins-01.svg",
    title: "Get Loans",
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
  return (
    <div className="mt-[48px] h-auto  h[calc(100vh-100px)] overflow-y-auto">
      <div className="h-[224px] border-2 rounded-[8px] bg-[#D1DCE5] p-4 flex flex-col justify-between">
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
        <Link href="/chat" className="flex justify-between items-center">
          <p className=" text-[18px] text-[#1A1A1A] font-medium">Echo Ai</p>
          <Image
            className="w-[6px] h-[12px]"
            src="/right.svg"
            width={6}
            height={12}
            alt="icon"
          />
        </Link>
      </div>
    </div>
  );
};

const TransactionView = () => (
  <div className="mt-[48px] justify-between mb-10">
    <div className="h-[224px] rounded-[8px] bg-[#D1DCE5] p-4 flex flex-col justify-between">
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
  const [showPopup, setShowPopup] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Simulating first visit check
    if (isFirstVisit) {
      setShowPopup(true);
    }
  }, [isFirstVisit]);

  const handleVerify = () => {
    // Handle verification logic here
    setShowPopup(false);
    setIsFirstVisit(false);
  };

  return (
    <div className="w-full relative h-screen flex flex-col max-w-md mx-auto p-6 pb-10 md:pb-0">
      <div className="flex-1 overflow-y-auto">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex md:w-1/2 gap-[16px] items-center">
              <Image
                className="bg-[#003056] rounded-full object-cover w-[40px] h-[40px]"
                src="/avater.png"
                width={40}
                height={40}
                alt="user avater"
              />
              <div>
                <p className="text-[#434343]">Good morning</p>
                <p className="text-[#1A1A1A] font-medium text-[20px]">Esther</p>
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

          <div className="h-[111px] w-full text-white mt-[60px] flex p-4 justify-between rounded-[8px] bg-[#003056]">
            <div className="flex flex-col justify-between">
              <p className="">Balance</p>
              <p className="text-[22px] md:text-[24px] font-semibold">
                N 200,000.00
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
        </div>

        {activeView === "home" && (
          <div className="w-full h-[90px] flex justify-evenly mt-[34px]">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col justify-between">
                <div className="flex justify-center rounded-[8px] mb-[8px] items-center p-2 bg-[#FAFAFA] h-[64px]">
                  <Image
                    className=" h-[24px] w-[24px]"
                    src={feature.image}
                    alt={feature.title}
                    width={12}
                    height={12}
                  />
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

        {showPopup && isFirstVisit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full h-[282px]">
              <div className="flex justify-between border-b relative items-center pb-2 mb-4">
                <h2 className="text-xl font-semibold">Verify Your Account</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-white w-[32px] h-[32px] bg-red-500 flex justify-center items-center  rounded-full absolute -top-8 -right-8 "
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col justify-between h-[80%]">
                <div>
                  <p className="mb-4">
                    To ensure the security of your account and enable full
                    access to EchoPay&apos;s features, please complete the
                    verification process.
                  </p>
                </div>
                <button
                  onClick={handleVerify}
                  className="w-full bg-[#003056] text-white py-2 px-4 rounded hover:bg-[#002040] transition duration-300"
                >
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        )}

        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-5">
          <div className="max-w-md mx-auto flex justify-around items-center h-16">
            {/* <div className="w-[60px] h-[60px] absolute -top-10 rounded-full bg-[#003056]">

          <Image className=" w-full h-full rounded-full" src="/ico.svg" alt="icon" width={24} height={24} />
          </div> */}
            <button
              onClick={() => setActiveView("home")}
              className={`flex flex-col items-center ${
                activeView === "home" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setActiveView("transaction")}
              className={`flex flex-col items-center ${
                activeView === "wallet" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <Wallet size={24} />
              <span className="text-xs mt-1">Transaction</span>
            </button>
            <button
              onClick={() => setActiveView("ai")}
              className={`flex flex-col items-center ${
                activeView === "ai" ? "text-[#003056]" : "text-gray-500"
              }`}
            >
              <MessageSquare size={24} />
              <span className="text-xs mt-1">Ai</span>
            </button>
            <button
              onClick={() => setActiveView("more")}
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
