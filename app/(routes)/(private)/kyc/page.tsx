'use client'

import React, { useState, useRef, useCallback, ChangeEventHandler } from 'react'
import Image from 'next/image'
import anonymous from "@/public/anonymous.svg"
import user from '@/public/user.svg'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import kycimg from '@/public/kycimg.png'
import Webcam from "react-webcam";

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3.00231C12.5299 3 12.0307 3 11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C20.9472 19.2703 20.998 17.147 20.9999 13" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" />
            <path d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M17 4.5C17.4915 3.9943 18.7998 2 19.5 2M19.5 2C20.2002 2 21.5085 3.9943 22 4.5M19.5 2V10" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

const stages = [
    {
        title: "Your Security, Our Priority",
        description: "We value your trust. This 3-step process helps ensure the safety of your financial information.",
        image: "kycimg.png",
    },
    {
        title: "Personal Information",
        description: "Provide your basic information to verify your identity.",
        fields: [
            { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your name and surname" },
            { name: "date", label: "Date of Birth", type: "date", placeholder: "DD/MM/YYYY" },
            { name: "nin", label: "NIN", type: "text", placeholder: "Enter your NIN" },
            { name: "bvn", label: "BVN", type: "text", placeholder: "Enter your BVN" },
        ],
    },
    {
        title: "NIN ID",
        description: "Please upload a clear image of your National Identification Number (NIN) card.",
    },
    {
        title: "Take a Selfie",
        description: "Take a selfie to confirm your identity. This is the last step in the verification process.",
    },
]

interface FormData {
    [key: string]: string;
}

export default function KYCProcess() {
    const [currentStage, setCurrentStage] = useState(0)
    const [formData, setFormData] = useState<FormData>({})
    const [showCamera, setShowCamera] = useState(false)
    const webcamRef = useRef<Webcam>(null)
    const [verify, setVerify] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileUpload = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
                setUploadedImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleContinue = () => {
        setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev))
    }

    const handleBack = () => {
        setCurrentStage((prev) => (prev > 0 ? prev - 1 : prev))
    }

    const handleCameraOpen = () => setShowCamera(true)

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            console.log("Captured image:", imageSrc)
            setShowCamera(false)
        }
    }, [])

    const stageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStage}
                    variants={stageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    {currentStage === 0 && (
                        <div className="text-center mt-[60px]">
                            <Image className='mb-[80px]' src="/kycimg.png"  alt="KYC" width={382} height={400} />
                            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">{stages[0].title}</h2>
                            <p className="text-[#434343] mb-8">{stages[0].description}</p>

                           <div>
                           <Button className="mt-8 w-full py-6 bg-[#003056]" onClick={handleContinue}>
                                get Started
                            </Button>
                           </div>
                        </div>

                    )}

                    {currentStage === 1 && (
                        <div className='mt-[32px]'>
                            <ArrowLeft onClick={handleBack} className='cursor-pointer' />
                            <p className='text-center'>Step {currentStage + 1} of {stages.length}</p>
                            <h2 className="text-2xl mt-6 font-semibold text-[#1A1A1A] mb-2">{stages[1].title}</h2>
                            <p className="text-[#434343] mb-6">{stages[1].description}</p>
                            <form className="space-y-4 mt-6">
                                {stages[1].fields?.map((field) => (
                                    <div key={field.name}>
                                        <Label htmlFor={field.name}>{field.label}</Label>
                                        <Input
                                            type={field.type}
                                            id={field.name}
                                            name={field.name}
                                            onChange={handleInputChange}
                                            required
                                            className='h-12'
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                                
                            </form>
                            <div>
                            <Button className="mt-8 w-full py-6 bg-[#003056]" onClick={handleContinue}>
                                Continue
                            </Button>
                           </div>
                        </div>
                    )}

                    {currentStage === 2 && (
                        <div className='mt-[32px]'>
                            <ArrowLeft onClick={handleBack} className='cursor-pointer' />
                            <p className='text-center'>Step {currentStage + 1} of {stages.length}</p>
                            <h2 className="text-2xl mt-6 font-semibold text-[#1A1A1A] mb-2">{stages[2].title}</h2>
                            <p className="text-[#434343] mb-6">{stages[2].description}</p>



                            <Card className='h-[180px] p-0 mt-[88px]' onClick={() => fileInputRef.current?.click()}>
                                <CardContent className="h-full w-full p-0 text-center flex items-center justify-center flex-col space-y-2">
                                    {uploadedImage ? (
                                        <img src={uploadedImage} alt="Uploaded Preview" className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <>
                                            <FileIcon className="w-12 h-12 mx-auto border-2 border-red-500" />
                                            <span className="text-[16px] font-medium text-gray-500">Upload image</span>
                                            <span className="text-sm text-gray-500">Click to upload image</span>
                                        </>
                                    )}

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        id="ninUpload"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </CardContent>
                            </Card>
                            <div>
                            <Button
                                disabled={!uploadedImage}
                            className="mt-8 w-full py-6 bg-[#003056]" onClick={handleContinue}>
                                get Started
                            </Button>
                           </div>
                        </div>

                    )}

                    {currentStage === 3 && (
                        <div className='mt-[32px] md:mt-[10px]'>
                            <div className='flex items-center gap-[90px]'>
                            <ArrowLeft onClick={handleBack} className='mb-2 cursor-pointer' />
                            {showCamera ? <h2 className="text-2xl mt6 text-center font-semibold text-[#1A1A1A] mb-2">Take Selfie</h2> : <h2 className="text-2xl mt6 text-center font-semibold text-[#1A1A1A] mb-2">Step {currentStage + 1} of {stages.length}</h2>}
                            </div>
                            {!showCamera && (
                                <div>
                                    <div className='flex mt-[24px] md:mt-[10px] items-center gap-[16px]'>
                                        <Image className='mb-6' src="user.svg" alt='anonymous' height={24} width={24} />
                                    <p className="text-[#434343] mb-6">Face forward and make sure your face is clearly visible</p>
                                    </div>
                                    <div className='flex items-center gap-[16px]'>
                                        <Image className='mb-6' src="anonymous.svg" alt='anonymous' height={24} width={24} />
                                    <p className="text-[#434343] mb-6">Remove anything covering your face, eyeglasses are allowed</p>
                                    </div>
                                    <Button className="w-full mt-[200px] py-6 bg-[#003056]" onClick={handleCameraOpen}>
                                        Take Selfie
                                    </Button>
                                </div>
                            )}
                            {showCamera && (
                                <div className="relatie my[4px]">
                                    
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full rounded-lg"
                                    />
                                    <div className="absoute  inset0 flex items-center justify-center">
                                        <div className="w-64 h-80 border-4 border-white rounded-full opacity-50 bg-[#343131]"></div>
                                    </div>
                                    <p className='text-[#434343] mt-[40px] text-[18px] text-center'>Position your face in the oval shape</p>
                                    <Button className="mt-[100px] w-full py-6 bg-[#003056]" onClick={handleCapture}>
                                    Take Selfie
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            {/* {currentStage < stages.length - 1 && (
                <Button className="mt-8 w-full py-6 bg-[#003056]" onClick={handleContinue}>
                    {currentStage === stages.length - 2 ? 'Finish' : 'Continue'}
                </Button>
            )} */}
        </div>
    )
}
