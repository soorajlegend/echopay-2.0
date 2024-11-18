"use client";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

interface ConfirmTransactionProps {
  selectedBank: string;
  accountNumber: string;
  amount: string;
  onBankSelect: (bank: string) => void;
  onAccountChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onContinue: () => void;
}


const ConfirmTransaction = ({ selectedBank,
    accountNumber,
    amount,
    onBankSelect,
    onAccountChange,
    onAmountChange,
    onContinue}: ConfirmTransactionProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const [banks, setBanks] = useState<{ [key: string]: string }>({});
        const [isLoadingBanks, setIsLoadingBanks] = useState(false);

        // get banks names from api and store in a state when ever the page is visited
        useEffect(() => {

          const fetchBanks = async () => {
            setIsLoadingBanks(true);
            try {
              const response = await axios.get("https://echo-pay.onrender.com/api/get-bank-list/");
              // Assuming the API returns an object like { bankCode: "Bank Name" }
              const banksList = response.data?.responseBody?.data || [];

              const banksMap = banksList.reduce((acc: { [key: string]: string }, bank: any) => {
                acc[bank.code] = bank.name;
                return acc;
              }, {});

              setBanks(banksMap);
            } catch (error) {
              console.error("Error fetching banks:", error);
            } finally {
              setIsLoadingBanks(false);
            }
          };

          fetchBanks()

        }, [])
  return (
    <div className='w-full h-full max-w-lg mx-auto flex flex-col'>
    <div className='my-[40px] flex justifybetween items-center gap-[40px]'>

        <Link href="/dashboard" className="text-2xl font-medium text-start text-[#1A1A1A]">
            <MoveLeft className="w-[20px] h-[20px]" />
        </Link>

        <div className='flex items-center hfull gap-[16px]'>
        <Image className='w-[62px] h-[62px]' src="/ai.svg" alt="transaction" width={62} height={62} />
        <h2 className="text-2xl font-medium text-start text-[#1A1A1A]">
            Confirmation
        </h2>
        </div>
        

    </div>
        <p className='mt10 text-center text-[#1A1A1A] text-[16px]'>Enter user bank details</p>
    <div className='mt-[20px]'>
        <div>
        <Select 
        open={isOpen} 
        onOpenChange={setIsOpen}
         value={selectedBank}>
    <div className="mt-6 flex justify-start">
      <Label htmlFor="terms" className=" text-[16px]">
        Bank
      </Label>
    </div>
    {/* <SelectLabel>Languages</SelectLabel> */}
    <SelectTrigger id="terms" className="w-full mt-[8px]">
      <SelectValue placeholder={isLoadingBanks ? "Loading banks..." : "Select a bank"}>
      {selectedBank && banks[selectedBank] ? banks[selectedBank] : "Select a bank"}
      </SelectValue>
    </SelectTrigger>
    <SelectContent className="w-[92%] p-5">
      <SelectGroup>
        <div className="w-[89%]">
          <RadioGroup
            className=""
            value={selectedBank}
            onValueChange={(bank) => {
                onBankSelect(bank);
                setIsOpen(false)}}
          >
            {Object.entries(banks).map(([value, label]) => (
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
        </div>

        <div className='w-full flex flex-col gap-2 mt-[24px] items-start'>
            <label id='accountNumber' className="text-[16px]">Account Number</label>
            <Input
                value={accountNumber}
                onChange={(e) => onAccountChange(e.target.value)}
                id='accountNumber'
                type="text"
            className='w-full h-10 py-2 text-left text-xl' placeholder="Enter account number" />
        </div>

        <div className='wfull flex flex-col gap-2 mt-[24px] items-start'>
            <label id='amount' className="text-[16px]">Amount</label>
            <Input
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                id='amount'
                type="text"
                className='w-full h-10 py-2 text-left text-xl' placeholder="Enter amount" />
        </div>

        {/* TODO: add button */}
        <div className=" w-full mt-[50px]  border bottom-0">
            <Button onClick={onContinue} className="w-full h-10 text-center text-xl font-medium text-white py-4 bg-[#003056]">Continue</Button>

        </div>
    </div>
    </div>
  )
}

export default ConfirmTransaction