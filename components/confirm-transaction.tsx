"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cleanPhoneNumber } from "@/lib/utils";
import axios from "axios";
import useBeneficiary from "@/hooks/use-beneficiary";
import { NewTransactionType } from "@/types";
import useTransaction from "@/hooks/use-transaction";
import useUserInfo from "@/hooks/use-userinfo";
import { Card } from "./ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import PasswordInput from "./password-input";

interface ConfirmTransactionProps {
  data: NewTransactionType | null;
  setNewTransaction: (value: NewTransactionType | null) => void;
}

const ConfirmTransaction = ({
  data,
  setNewTransaction,
}: ConfirmTransactionProps) => {
  const { beneficiaries } = useBeneficiary();
  const { addTransaction } = useTransaction();
  const { info, setInfo } = useUserInfo();

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);

  const closeRef = useRef<HTMLButtonElement>(null);

  if (!data) {
    return null;
  }

  const beneficiary = beneficiaries.find(
    (beneficiary) => beneficiary.id === Number(data.beneficiaryId)
  );

  if (!beneficiary) {
    console.log("No beneficiary found", data);
  }

  const createTransaction = async () => {
    if (!info) {
      return toast.error("Please login to continue");
    }

    if (isLoading) {
      console.log("already loading");
      return;
    }

    if (!beneficiary) {
      console.log("No beneficiary found", data);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://echo-pay.onrender.com/api/transfer",
        {
          sender: info.phone,
          receiver: cleanPhoneNumber(beneficiary.acc_num),
          amount: data.amount,
          narration: data.description,
          pin: password,
        }
      );

      setPassword("");

      if (response.status === 200) {
        toast.success("Transaction completed successfully");
        addTransaction({
          ...response.data.responseBody,
          isCredit: false,
        });

        if (info) {
          setInfo({
            ...info,
            balance: info.balance - data.amount,
          });
        }

        if (closeRef.current) {
          closeRef.current.click();
        }
        setNewTransaction(null);
      } else {
        toast.error(response.data.message || "Something went wrong");
        setShowPinInput(false);
      }
    } catch (error) {
      toast.error("Failed to complete transaction");
      setShowPinInput(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open onClose={() => setNewTransaction(null)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="w-full text-center">
            Confirm Transaction
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-10 px-3 lg:px-0">
          <Card className="p-3 border-gray-100/80 text-gray-800 w-full h-auto flex gap-3 max-w-md mx-auto">
            <Avatar className="w-10 h-10">
              <AvatarImage src={beneficiary?.avatar} />
              <AvatarFallback className="font-bold">
                {beneficiary?.acc_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-sm font-bold text-gray-900">
                {beneficiary?.acc_name}
              </div>
              <div className="text-sm">{data.description}</div>
            </div>
            <div className="text-base font-semibold px-2 text-rose-500">
              ₦{data?.amount}
            </div>
          </Card>
        </div>
        <div className="p-10 px-3 lg:px-0">
          <Card className="p-3 border-gray-100/80 text-gray-800 w-full h-auto flex justify-center items-center max-w-md mx-auto">
            <PasswordInput
              label="Verify your pin"
              onComplete={createTransaction}
              value={password}
              setValue={setPassword}
              disabled={isLoading}
            />
          </Card>
        </div>

        <div className="flex justify-between gap-3 w-full py-3 max-w-md mx-auto px-3 lg:px-0">
          <DrawerClose
            disabled={isLoading}
            onClick={() => setNewTransaction(null)}
          >
            <Button disabled={isLoading} ref={closeRef} variant="ghost">
              Cancel
            </Button>
          </DrawerClose>
          <Button onClick={() => setShowPinInput(true)} disabled={isLoading}>
            {isLoading ? "Loading..." : "Cornfirm"}
            {isLoading && <Loader className="w-6 h-6 animate-spin ml-2" />}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmTransaction;
