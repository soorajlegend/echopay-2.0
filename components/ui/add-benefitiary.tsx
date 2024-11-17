"use client"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./button"
import { Plus } from "lucide-react"
import { Label } from "./label"
import { Input } from "./input"
import { FormEvent, useRef, useState } from "react"
import { toast } from "sonner"
import { cleanPhoneNumber } from "@/lib/utils"
import axios from "axios"
import useBeneficiary from "@/hooks/use-beneficiary"

const AddBeneficiary = () => {

    const { addBeneficiary, beneficiaries } = useBeneficiary()


    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('234')
    const [isLoading, setIsLoading] = useState(false)

    const closeRef = useRef<HTMLButtonElement>(null)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        if (name.length < 3) {
            setIsLoading(false)
            return toast.error("Name must be at least 3 characters")
        }

        if (mobile.length < 10) {
            setIsLoading(false)
            return toast.error("Account number must be at least 10 digits")
        }

        if (beneficiaries.find(current => current.acc_name.toLowerCase() === name.toLowerCase())) {
            setIsLoading(false)
            return toast.error("Beneficiary with this name already exists")
        }

        if (beneficiaries.find(current => current.acc_num.toLowerCase() === mobile.toLowerCase())) {
            setIsLoading(false)
            return toast.error("Beneficiary with this account number already exists")
        }

        const response = await axios.post("https://fintech-gpt.onrender.com/user/addBeneficiary", {
            "phone": "user.id",
            "acc_name": name,
            "acc_num": cleanPhoneNumber(mobile),
            "bank_name": "GPT",
            "image": "001",
        })

        if (response.status === 200) {
            toast.success("Beneficiary added")
            addBeneficiary(response.data.beneficiary)

            if (closeRef?.current) {
                closeRef.current.click()
            }
        }
        setIsLoading(false)

    }

    return (
        <Drawer>
            <DrawerTrigger className="fixed bottom-20 right-5 md:right-[30%] lg:right-[49%] lg:translate-x-[12rem] bg-main h-14 w-14 text-white flex items-center justify-center rounded-full">
                <Plus className="w-10 h-10" />
            </DrawerTrigger>
            <DrawerContent className="lg:max-w-lg mx-auto">
                <DrawerHeader>
                    <DrawerTitle className="text-center w-full">
                        Add a new beneficiary
                    </DrawerTitle>
                </DrawerHeader>
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm mx-auto py-10 px-3 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input
                            value={name}
                            disabled={isLoading}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Phone Number</Label>
                        <Input
                            type="tel"
                            value={mobile}
                            disabled={isLoading}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                    <Button
                        disabled={isLoading}
                        className="w-full">Save</Button>
                </form>
                <DrawerClose className="hidden">
                    <Button
                        ref={closeRef}
                        variant="outline">
                        Cancel
                    </Button>
                </DrawerClose>
            </DrawerContent>
        </Drawer>

    )
}

export default AddBeneficiary