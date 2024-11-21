"use client";
import React from "react";
import { MoveLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/use-userinfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";

interface TransactionDetail {
  amount: number;
  date: string;
  isCredit: boolean;
  narration: string;
  receiverName: string;
  receiverPic: string | null;
  refid: string;
  senderName: string;
  senderPic: string | null;
}

const Page = () => {
  const [transaction, setTransaction] = useState<TransactionDetail[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { info } = useUserInfo();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://echo-pay.onrender.com/api/get-transaction/${info?.phone}`
        );

        if (
          response.status === 200 &&
          Array.isArray(response.data.responseBody)
        ) {
          setTransaction(response.data.responseBody); // Ensure it's an array
        } else {
          setTransaction([]); // Fallback to an empty array if data isn't an array
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransaction([]); // Handle error with an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [info]);

  console.log(transaction);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-y-auto h-full p-6 justify-between mb-10">
      <div className="">
        <div className="flex justify-between items-center">
          <MoveLeft
            onClick={() => router.back()}
            className="w-[24px] h-[24px] cursor-pointer text-[#003056]"
          />
          <h2>Transction history</h2>
          <Bell className="w-[24px] h-[24px] cursor-pointer text-[#003056]" />
        </div>

        <div className="mt-[24px]">
          <Tabs defaultValue="recent" className="">
            <TabsList className="grid w-[80%] mx-auto grid-cols-3 bg-transparent">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="send">Sent</TabsTrigger>
              <TabsTrigger value="receive">Received</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              <Card className="border">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your transaction history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <p className="text-gray-500">Loading transactions...</p>
                    </div>
                  ) : transaction?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    transaction?.map((transac, index) => (
                      <ul key={index} className="mt-[10px]">
                        <Link href={`/dashboard/transaction/${transac.refid}`}>
                          <li className="flex justify-between items-center py-4 mt-3">
                            <div>
                              <p className="font-medium">
                                {transac?.isCredit
                                  ? `Transfer from ${transac?.senderName}`
                                  : `Transfer to ${transac?.receiverName}`}
                              </p>

                              <p>{formatDate(new Date().getTime())}</p>
                            </div>
                            <p
                              className={`${
                                transac.isCredit
                                  ? "text-green-500 font-medium"
                                  : "text-red-500"
                              }`}
                            >
                              ₦{transac.amount}
                            </p>
                          </li>
                        </Link>
                      </ul>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Funds</CardTitle>
                  <CardDescription>
                    View your sent transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <p className="text-gray-500">Loading transactions...</p>
                    </div>
                  ) : transaction?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    transaction
                      ?.filter((trnx) => !trnx.isCredit)
                      ?.map((transac, index) => (
                        <ul key={index} className="mt-[10px]">
                          <Link
                            href={`/dashboard/transaction/${transac.refid}`}
                          >
                            <li className="flex justify-between items-center py-4 mt-3">
                              <div>
                                <p className="font-medium">
                                  {transac?.isCredit
                                    ? `Transfer from ${transac?.senderName}`
                                    : `Transfer to ${transac?.receiverName}`}
                                </p>

                                <p>{formatDate(new Date().getTime())}</p>
                              </div>
                              <p
                                className={`${
                                  transac.isCredit
                                    ? "text-green-500 font-medium"
                                    : "text-red-500"
                                }`}
                              >
                                ₦{transac.amount}
                              </p>
                            </li>
                          </Link>
                        </ul>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="receive">
              <Card>
                <CardHeader>
                  <CardTitle>Received Funds</CardTitle>
                  <CardDescription>
                    View your received transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <p className="text-gray-500">Loading transactions...</p>
                    </div>
                  ) : transaction?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    transaction
                      ?.filter((trnx) => trnx.isCredit)
                      ?.map((transac, index) => (
                        <ul key={index} className="mt-[10px]">
                          <Link
                            href={`/dashboard/transaction/${transac.refid}`}
                          >
                            <li className="flex justify-between items-center py-4 mt-3">
                              <div>
                                <p className="font-medium">
                                  {transac?.isCredit
                                    ? `Transfer from ${transac?.senderName}`
                                    : `Transfer to ${transac?.receiverName}`}
                                </p>

                                <p>{formatDate(new Date().getTime())}</p>
                              </div>
                              <p
                                className={`${
                                  transac.isCredit
                                    ? "text-green-500 font-medium"
                                    : "text-red-500"
                                }`}
                              >
                                ₦{transac.amount}
                              </p>
                            </li>
                          </Link>
                        </ul>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
