"use client"
import React from 'react'
import { Bell, MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
const Page = () => {
  const router = useRouter()
  const params = useParams()
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log(params)
  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://echo-pay.onrender.com/api/get-transaction-details/${params.refid}`
        )
        setTransaction(response.data.responseBody)
      } catch (error) {
        console.error("Error fetching transaction:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionDetail()
  }, [params.refid])

  console.log(transaction)
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <div className='overflow-y-auto h-full p-6 justify-between mb-10'>
      <div className=''>
      <div className="flex justify-between items-center">
      <MoveLeft onClick={() => router.back()} className="w-[24px] h-[24px] cursor-pointer text-[#003056]" />
    <h2>Transction Detail</h2>
    <Bell className="w-[24px] h-[24px] cursor-pointer text-[#003056]" />
    </div>

    {loading ? (<div>loading...</div>) : (
      <div>
        <Card className='w-[180px] border-none mt-[24px] mx-auto p-0 h-[160px]'>
          <CardHeader className='p-2 flex justify-center items-center'>
            <CardTitle >
              <p className='text-[#737373] text-[10px]'>{formatDate(new Date().getTime())}</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 mt-[10px]">
           <Image className='w-[40px] mx-auto h-[40px]' src="/user-switch.png" alt="logo" width={100} height={100} />
           <p className=' text-center mt-[8px] text-[#737373] text-[12px]'>Transfer</p>
          </CardContent>
          <CardFooter className='p-2 mt-[8px] flex justify-center items-center'>
            <p className='text-[#1A1A1A] text-center'>{`N ${transaction?.amount}`}</p>
          </CardFooter>
        </Card>
        
        <div className='mt-[24px]'>
        <Card className="w-full max-w-md border-none mx-auto">
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between items-center border-b-2 border-dashed my-2 py-3">
          <Label htmlFor="from" className="font-medium">From:</Label>
          <div className='flex flex-col col-span-2 pl-2'>
            <span id="from">{transaction?.senderName}</span>
            <p className="text-sm text-muted-foreground">{transaction?.date}</p>
          </div>
        </div>
        <div className="flex justify-between items-center border-b-2 border-dashed my-2 py-3">
          <Label htmlFor="to" className="font-medium">To:</Label>
          <div className='flex flex-col col-span-2 pl-2'>
            <span id="to">{transaction?.receiverName}</span>
            <p className="text-sm text-muted-foreground">{transaction?.date}</p>
          </div>
        </div>

        <div className="flex justify-between  items-center border-b-2 border-dashed my-2 py-3"> 
          <Label htmlFor="narration" className="font-medium">Narration:</Label>
          <span id="narration" className="col-span-2 pl-2">{transaction?.narration}</span>
        </div>

        <div className="flex justify-between items-center border-b-2 border-dashed my-2 py-3">
          <Label htmlFor="reference" className="font-medium">Reference Number:</Label>
          <span id="reference" className="colspan-2 pl-2 text-right">{transaction?.refid}</span>
        </div>
      </CardContent>
    </Card>
        </div>

        <div className='mt-[24px] gap-[32px] flex justify-center items-center'>
        <Card className='border cursor-pointer mt-[24px] px-3'>
          <CardContent className="p-2 mt-[10px]">
           <Image className='w-[40px] mx-auto h-[40px]' src="/share.png" alt="logo" width={100} height={100} />
           <p>Share</p>
          </CardContent>
        </Card>
        <Card className='border cursor-pointer mt-[24px] px-3'>
          <CardContent className="p-2 mt-[10px]">
           <Image className='w-[40px] mx-auto h-[40px]' src="/repeat.png" alt="logo" width={100} height={100} />
           <p>Repeat</p>
          </CardContent>
        </Card>
        </div>
      </div>
    )}
      </div>
    </div>
  )
}

export default Page