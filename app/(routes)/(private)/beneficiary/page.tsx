"use client";
import React, { useState } from "react";
import { MoveLeft, Bell, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const beneficiaryData = [
  {
    id: "BEN001",
    name: "John Smith",
    bankName: "Access Bank",
    accountNumber: "1234567890",
    url: "/beneficiary/BEN001",
  },
  {
    id: "BEN002",
    name: "Sarah Williams",
    bankName: "First Bank",
    accountNumber: "2345678901",
    url: "/beneficiary/BEN002",
  },
  {
    id: "BEN003",
    name: "Michael Chen",
    bankName: "GT Bank",
    accountNumber: "3456789012",
    url: "/beneficiary/BEN003",
  },
  {
    id: "BEN004",
    name: "Emma Rodriguez",
    bankName: "UBA",
    accountNumber: "4567890123",
    url: "/beneficiary/BEN004",
  },
  {
    id: "BEN005",
    name: "David Thompson",
    bankName: "Zenith Bank",
    accountNumber: "5678901234",
    url: "/beneficiary/BEN005",
  },
];

const Page = () => {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddBeneficiary = () => {
    router.push("/beneficiary/add-beneficiary");
  }

  return (
    <div className="h-full flex flex-col justify-between p-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-[40px] mb-6">
          <MoveLeft
            onClick={() => router.back()}
            className="w-[24px] h-[24px] cursor-pointer text-[#003056]"
          />
          <h2>Beneficiary Management</h2>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transfers">
          <TabsList className="grid w-[80%] mx-auto grid-cols-3 bg-transparent mb-6">
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="airtime">Airtime</TabsTrigger>
          </TabsList>

          {/* Transfers Tab */}
          <TabsContent className="h-full" value="transfers">
            <Card className="h-[calc(100vh-200px)] flex flex-col border-none">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your transaction history</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto space-y-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                ) : beneficiaryData?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                ) : (
                  beneficiaryData?.map((beneficiary, index) => (
                    <ul key={index} className="mt-[10px]">
                      <Link href={`/dashboard/transaction/${beneficiary?.url}`}>
                        <li className="flex justify-between border rounded-[8px] px-1 items-center py-4 mt-3">
                          <div>
                            <p className="font-medium">{beneficiary?.name}</p>
                            <div className="flex gap-1">
                              <p className="text-[12px]">{beneficiary?.bankName}</p>
                              <p className="text-[12px]">{beneficiary?.accountNumber}</p>
                            </div>
                          </div>
                          <p className={beneficiary?.bankName}>
                            {beneficiary?.accountNumber}
                          </p>
                        </li>
                      </Link>
                    </ul>
                  ))
                )}
              </CardContent>
              <div className="p-4">
                <Button onClick={handleAddBeneficiary} className="w-full">Add Beneficiary</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="bills">
            <Card>
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>Send money to friends or pay for goods and services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <ArrowUpIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>To: John Doe - $50.00</span>
                </div>
                <div className="flex items-center">
                  <ArrowUpIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>To: Jane Smith - $25.00</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="airtime">
            <Card>
              <CardHeader>
                <CardTitle>Receive Money</CardTitle>
                <CardDescription>View incoming transactions and payment requests.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <ArrowDownIcon className="mr-2 h-4 w-4 text-blue-500" />
                  <span>From: Alice Johnson - $30.00</span>
                </div>
                <div className="flex items-center">
                  <ArrowDownIcon className="mr-2 h-4 w-4 text-blue-500" />
                  <span>From: Bob Williams - $15.50</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
