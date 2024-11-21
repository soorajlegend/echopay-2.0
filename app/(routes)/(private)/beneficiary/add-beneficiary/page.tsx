"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { MoveLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2 } from "lucide-react"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectValue,
  } from "@/components/ui/select";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import useUserInfo from '@/hooks/use-userinfo'

const Page = () => {
        const {info} = useUserInfo()
        const [isOpen, setIsOpen] = useState(false);
        const [banks, setBanks] = useState<{ [key: string]: string }>({});
        const [isLoadingBanks, setIsLoadingBanks] = useState(false);
        const [selectedBank, setSelectedBank] = useState("")
        const [loading, setIsLoading] = useState(false);
        const [alias, setAlias] = useState("");
        const [accountNumber, setAccountNumber] = useState("");
        const [accountName, setAccountName] = useState("");
        const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');;
        const [error, setError] = useState("");
        const router = useRouter()
        const [showSuccess, setShowSuccess] = useState(false)


    useEffect(() => {
        const fetchBanks = async () => {
            setIsLoadingBanks(true);
            try {
              const response = await axios.get("https://echo-pay.onrender.com/api/get-bank-list/");
              // Assuming the API returns an object like { bankCode: "Bank Name" }
              const banksList = response.data?.responseBody?.data || [];

              banksList.push({
                code: "000014",
                name: "Echo Pay",
              });

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

    const handleBankSelect = (bank: string) => {
        setSelectedBank(bank);
        setIsOpen(false); // This will close the modal
      };

      const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("am in")
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 11) {
          setAccountNumber(value);
        }
    
        if (value.length === 11) {
          setVerificationStatus('loading');
          try {
            const response = await axios.post("https://echo-pay.onrender.com/api/verify-account", {
              account_number: value,
              bank_name: "echo-pay"
            });

            console.log(response.data.responseBody.name, "from verify account")
    
            if (response.data?.responseBody?.name) {
              setAccountName(response.data.responseBody.name);
              setVerificationStatus('success');
            } else {
              setVerificationStatus('error');
            }
          } catch (error) {
            setVerificationStatus('error');
          }
        }
      };
    

      const handleAddBeneficiary = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post("https://echo-pay.onrender.com/api/add-beneficiary", {
            phone: info?.phone, // You can get this from user context/state
            acc_name: banks[selectedBank],
            acc_num: accountNumber,
            bank_name: banks[selectedBank],
            bank_code: selectedBank
          });
          console.log(response.data)
          if (response.data) {
            setShowSuccess(true);
          }
        } catch (error) {
          console.error("Error adding beneficiary:", error);
        } finally {
          setIsLoading(false);
        }
      };
    
      console.log(info)
      if (showSuccess) {
        return (
          <div className="h-full flex flex-col items-center justify-center p-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#003056] mb-4">Beneficiary Added Successfully!</h2>
              <Button 
                className="bg-[#003056] text-white px-6 py-2 rounded-lg"
                onClick={() => router.push("/dashboard")}
              >
                Go to Home
              </Button>
            </div>
          </div>
        );
      }
    

    console.log(banks)
  return (
    <div className="h-full flex flex-col justify-between p-5">
        <div className='relative'>

        <div className="flex items-center gap-[40px] mb-6">
          <MoveLeft
            onClick={() => router.back()}
            className="w-[24px] h-[24px] cursor-pointer text-[#003056]"
          />
          <h2>Beneficiary Management</h2>
        </div>

        <div>
            <h2>Transfer</h2>

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
            onValueChange={handleBankSelect}
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
        <div className='mt-[24px]'>
                    <Label id="account">Account Number</Label>
                    <Input className='h-10'
                    value={accountNumber} id="account" onChange={handleAccountNumberChange} 
                    maxLength={11} placeholder='Enter Account No' />
                     {verificationStatus === 'loading' && (
        <p className="mt-2 text-gray-500">Verifying account...</p>
      )}
      {verificationStatus === 'success' && (
        <p className="mt-2 text-green-600">{accountName}</p>
      )}
      {verificationStatus === 'error' && (
        <p className="mt-2 text-red-600">Account not found</p>
      )}
                </div>
                <div>
               
                <div className='mt-[24px]'>    
                    <Label id='alias'>Alias</Label>
                    <Input className='h-10' type='text' onChange={(e) => setAlias(e.target.value)}  value={alias} id='alias' placeholder='Enter Alias' />
                </div>

                {/* add button */}
                <div className='mt-[100px]'>    
                    <Button disabled={loading} onClick={handleAddBeneficiary} className='bg-[#003056] w-full text-white px-4 py-2 rounded-lg'>
                       {loading ? (
                        <Loader2 className="w-6 h-6 text-white/90 animate-spin" />
                      ) : (
                        "Add Beneficiary"
                      )}
                    </Button>
                </div>
            </div>
        </div>
        </div>

    </div>
  )
}

export default Page