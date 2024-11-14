import React from "react";
import Image from "next/image";

const features = [
  {
    image: "/arrow-up-down.svg",
    title: "Transfer"
  },
  {
    image: "/globe-02.svg",
    title: "Buy Data"
  },
  {
    image: "/invoice-01.svg",
    title: "Buy Airtime"
  },
  {
    image: "/coins-01.svg",
    title: "Get Loans"
  },
]
const DashboardPage = () => {
  return (
    <div className="w-full border-2 max-w-md mx-auto p-6">

      <div className="flex justify-between items-center">
        <div className="flex md:w-1/2 gap-[16px] items-center">
          <Image className="bg-[#003056] rounded-full object-cover w-[40px] h-[40px]" src="/avater.png" width={40} height={40} alt="user avater"/>
          <div>
            <p className="text-[#434343]">Good morning</p>
            <p className="text-[#1A1A1A] font-medium text-[20px]">Esther</p>
          </div>
        </div>
        <div>
          <Image src="/notification.svg" width={24} height={24} alt="notification icon" />
        </div>
      </div>

    <div className="h-[111px] w-full text-white mt-[60px] flex p-4 justify-between rounded-[8px] bg-[#003056]">
      <div className="flex flex-col justify-between">
        <p className="">Balance</p>
        <p className="text-[22px] md:text-[24px] font-semibold">N 200,000.00</p>
      </div>
      <div className="relative flex flex-col justify-end w-1/2">
        <Image className="absolute h-[80px] w-[74px] -top-4 -right-4" src="/echo.svg" width={0} height={0} alt="logo" />
        <div className="flex justify-end">
        <Image className=" h-[20px] mb-1 w-[20px]" src="/eye.svg" width={20} height={14} alt="eye icon" />

        </div>
      </div>
    </div>

    <div className="w-full h-[90px] flex justify-evenly mt-[34px]">
      {features.map((feature, index) => 
        <div className="flex flex-col items-center justify-between">
          <div className="bg-[#FAFAFA] rounded-[8px] w-[64px] h-[64px] flex items-center justify-center mb-[8px]">

          <Image className=" h-[24px] w-[24px]" src={feature.image} alt={feature.title} width={12} height={12} />
          </div>
          <p>{feature.title}</p>
        </div>
      )}
    </div>

    <div>
      
    </div>
    </div>
  );
};

export default DashboardPage;
