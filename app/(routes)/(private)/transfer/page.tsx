"use client"
import { MoveLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import useUserInfo from '@/hooks/use-userinfo'
import Link from 'next/link'
const Page = () => {
    const {info} = useUserInfo()
    const router = useRouter()
  return (
    <div className='overflow-y-auto h-full p-6 justify-between mb-10'>
        <div>
        <div className="flex gap-[100px] items-center">
      <MoveLeft onClick={() => router.back()} className="w-[24px] h-[24px] cursor-pointer text-[#003056]" />
    <h2>Transfer</h2>
    </div>

    <div className="h-[111px] w-full text-white mt-[60px] flex p-4 justify-between rounded-[8px] bg-[#003056]">
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

    <div className='mt-[43px]'>
        <h3 className='text-[#003056] text-[18px] leading-[24px] font-medium'>Select Transfer Option</h3>
        <Link href="/transfer-echo">
        <div className='flex border-2 mt-[16px] p-3  rounded-[8px] items-center gap-[30px]'>
            <Image width={24} height={24} src="/transfer-echo.png" alt="logo" />
            <div className='flex items-center w-[90%] justify-between'>
                <div>
                <p className='text-[#141B34] text-[16px] leading-[24px] font-medium'>Transfer to Echopay</p>
                <span className='text-[#B0B0B0] text-[12px]'>Transfer to Echopay users</span>
                </div>
            <ChevronRight className='w-[24px] h-[24px] text-[#141B34]' />
            </div>
        </div>
        </Link>
        

        <div className='flex border-2 mt-[16px] p-3 cursor-pointer rounded-[8px] items-center gap-[30px]'>
            <Image width={24} height={24} src="/bank.png" alt="logo" />
            <div className='flex items-center w-[90%] justify-between'>
                <div>
                <p className='text-[#141B34] text-[16px] leading-[24px] font-medium'>Transfer to Bank</p>
                <span className='text-[#B0B0B0] text-[12px]'>Transfer to other banks</span>
                </div>
            <ChevronRight className='w-[24px] h-[24px] text-[#141B34]' />
            </div>
        </div>
    </div>

        </div>
    </div>
  )
}

export default Page