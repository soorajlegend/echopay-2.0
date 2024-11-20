"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, Check, X, Loader2, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Webcam from "react-webcam";
import axios from "axios";
import useUserInfo from "@/hooks/use-userinfo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function FileIcon({ ...props }) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13 3.00231C12.5299 3 12.0307 3 11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C20.9472 19.2703 20.998 17.147 20.9999 13"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 4.5C17.4915 3.9943 18.7998 2 19.5 2M19.5 2C20.2002 2 21.5085 3.9943 22 4.5M19.5 2V10"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const stages = [
  {
    title: "Your Security, Our Priority",
    description:
      "We value your trust. This 3-step process helps ensure the safety of your financial information.",
    image: "kycimg.png",
  },
  {
    title: "Personal Information",
    description: "Provide your basic information to verify your identity.",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "Enter your name and surname",
      },
      {
        name: "date",
        label: "Date of Birth",
        type: "date",
        placeholder: "DD/MM/YYYY",
      },
      {
        name: "nin",
        label: "NIN",
        type: "text",
        placeholder: "Enter your NIN",
      },
      {
        name: "bvn",
        label: "BVN",
        type: "text",
        placeholder: "Enter your BVN",
      },
    ],
  },
  {
    title: "NIN ID",
    description:
      "Please upload a clear image of your National Identification Number (NIN) card.",
  },
  {
    title: "Take a Selfie",
    description:
      "Take a selfie to confirm your identity. This is the last step in the verification process.",
  },
];

interface FormData {
  [key: string]: string;
}

export default function KYCProcess() {
  const [currentStage, setCurrentStage] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "fail" | null
  >(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraOpen = () => setShowCamera(true);
  const { info, setInfo } = useUserInfo();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
  };

  const handleBack = () => {
    setCurrentStage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowCamera(false);
    }
  }, []);

  const handleRetake = () => {
    setCapturedImage(null);
    setVerificationStatus(null);
    setShowCamera(true);
  };

  const handleProceed = async () => {
    setIsProcessing(true);
    if (!info) {
      toast.error("User not found");
      return;
    }
    // Make API call to verify KYC

    try {
      console.log({
        phone: info.phone || info.email,
        fullname: formData.fullname || info.fullname,
        dob: formData.dob || "",
        nin: formData.nin || "",
        bvn: formData.bvn || "",
      });

      const response = await axios.post(
        "https://echo-pay.onrender.com/api/add-kyc",
        {
          phone: info.phone || info.email,
          fullname: formData.fullname || info.fullname,
          dob: formData.dob || "",
          nin: formData.nin || "",
          bvn: formData.bvn || "",
        }
      );
      console.log("KYC verification response:", response.data);
      setInfo({ ...info, isVerified: true });
      setVerificationStatus("success");
    } catch (error) {
      console.error("Error verifying KYC:", error);
    }
    // setTimeout(() => {
    //   setIsProcessing(false);
    //   // Randomly set success or fail for demo purposes
    //   setVerificationStatus("success");
    // }, 3000);
  };
  const handleHome = () => {
    // Implement navigation to home page
    router.push("/dashboard");
  };

  const stageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <AnimatePresence mode="wait">
        <motion.div
          className="m-0 p-0 inset-0"
          key={currentStage}
          variants={stageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentStage === 0 && (
            <div className="text-center mt[60px]">
              <Image
                className="mb-[80px]"
                src="/kycimg.png"
                alt="KYC"
                width={382}
                height={400}
              />
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                {stages[0].title}
              </h2>
              <p className="text-[#434343] mb-8">{stages[0].description}</p>
              <div className="mt-auto">
                <Button
                  className="mt-8 w-full py-6 bg-[#003056]"
                  onClick={handleContinue}
                >
                  get Started
                </Button>
              </div>
            </div>
          )}

          {currentStage === 1 && (
            <div className="absolute inset-0 w-full max-w-md mx-auto p-6 wfull h-full p4 flex flex-col justify-between">
              <div className="flex-1 w-full h-full">
                <ArrowLeft onClick={handleBack} className="cursor-pointer" />
                <p className="text-center">
                  Step {currentStage + 1} of {stages.length}
                </p>
                <h2 className="text-2xl mt-6 font-semibold text-[#1A1A1A] mb-2">
                  {stages[1].title}
                </h2>
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
                        className="h-12"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </form>
              </div>
              <div className="mt-auto">
                <Button
                  className="w-full py-6 bg-[#003056]"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStage === 2 && (
            <div className="absolute inset-0 w-full max-w-md mx-auto p-6 wfull h-full p4 flex flex-col justify-between">
              <div className="flex-1 w-full h-full">
                <ArrowLeft onClick={handleBack} className="cursor-pointer" />
                <p className="text-center">
                  Step {currentStage + 1} of {stages.length}
                </p>
                <h2 className="text-2xl mt-6 font-semibold text-[#1A1A1A] mb-2">
                  {stages[2].title}
                </h2>
                <p className="text-[#434343] mb-6">{stages[2].description}</p>

                <Card
                  className="h-[180px] p-0 mt-[88px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="h-full w-full p-0 text-center flex items-center justify-center flex-col space-y-2">
                    {uploadedImage ? (
                      <Image
                        src={uploadedImage}
                        alt="Uploaded Preview"
                        width={400}
                        height={180}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <FileIcon className="w-12 h-12 mx-auto" />
                        <span className="text-[16px] font-medium text-gray-500">
                          Upload image
                        </span>
                        <span className="text-sm text-gray-500">
                          Click to upload image
                        </span>
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
                <div className="mt-auto">
                  <Button
                    disabled={!uploadedImage}
                    className="mt-8 w-full py-6 bg-[#003056]"
                    onClick={handleContinue}
                  >
                    get Started
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStage === 3 && (
            <div className="absolute inset-0 wfull h-full w-full max-w-md mx-auto p-6 p4 flex flex-col justify-between">
              <div className="flex-1 w-full h-full">
                {!isProcessing && !verificationStatus && (
                  <div className="flex items-center justify-between mb-6">
                    <ArrowLeft
                      onClick={handleBack}
                      className="cursor-pointer"
                    />
                    <h2 className="text-2xl font-semibold text-[#1A1A1A]">
                      {showCamera ? "Take Selfie" : "Step 4 of 4"}
                    </h2>
                    <div className="w-6" /> {/* Spacer for alignment */}
                  </div>
                )}

                {!showCamera &&
                  !capturedImage &&
                  !isProcessing &&
                  !verificationStatus && (
                    <div>
                      <div className="flex mt-[24px] md:mt-[10px] items-center gap-[16px] mb-4">
                        <Image
                          src="/user.svg"
                          alt="user"
                          height={24}
                          width={24}
                        />
                        <p className="text-[#434343]">
                          Face forward and make sure your face is clearly
                          visible
                        </p>
                      </div>
                      <div className="flex items-center gap-[16px] mb-6">
                        <Image
                          src="/anonymous.svg"
                          alt="anonymous"
                          height={24}
                          width={24}
                        />
                        <p className="text-[#434343]">
                          Remove anything covering your face, eyeglasses are
                          allowed
                        </p>
                      </div>
                      <Button
                        className="w-full mt-[200px] py-6 bg-[#003056]"
                        onClick={handleCameraOpen}
                      >
                        Take Selfie
                      </Button>
                    </div>
                  )}

                {showCamera && (
                  <div className="relative my-[4px]">
                    <div className="flex items-center justify-center">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="h-[250px] w-[200px] mt-[43px] rounded-full object-cover"
                      />
                    </div>
                    <p className="text-[#434343] mt-[40px] text-[18px] text-center">
                      Position your face in the oval shape
                    </p>
                    <Button
                      className="mt-[100px] w-full py-6 bg-[#003056]"
                      onClick={handleCapture}
                    >
                      Take Selfie
                    </Button>
                  </div>
                )}

                {capturedImage && !isProcessing && !verificationStatus && (
                  <div className="">
                    <div className="flex items-center justify-center">
                      <Image
                        src={capturedImage}
                        alt="Captured selfie"
                        width={160}
                        height={210}
                        className="rounded-full object-cover w-40 h-[210px]"
                      />
                    </div>
                    <div className="flex flex-col gap-4 mt-[170px]">
                      <Button
                        className="flex-1 py-4 bg-[#003056]"
                        onClick={handleProceed}
                      >
                        My selfie is clear
                      </Button>
                      <Button
                        className="flex-1 py-4 bg-transparent border border-[#003056] text-[#003056] hover:text-white"
                        onClick={handleRetake}
                      >
                        Retake photo
                      </Button>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-2xl font-semibold text-[#1A1A1A]">
                      Verification
                    </p>

                    <p className="text-[#434343] text-center">
                      Please wait while we process your verification details.
                      This may take a few minutes. Thank you for your patience
                    </p>
                    <Loader2 className="w-16 h-16 mt-20 text-[#003056] animate-spin" />
                  </div>
                )}

                {verificationStatus && (
                  <div className="flex flex-col h-screen items-center justify-center">
                    <p className="text-2xl font-semibold mb[60px] text-[#1A1A1A]">
                      Verification
                    </p>
                    <div className="flex justify-center">
                      <div className="flex justify-center h-[145px] w-[145px] items-center my-[64px] rounded-full text-center bg-[#1B9C12] text-white">
                        <Check className="w-24 h-24 text-white" />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="my-4 text-2xl text-[#1A1A1A]">
                        Verification Successful!
                      </p>
                      <p>
                        Your information has been verified successfully. You can
                        now enjoy full access to all EchoPay features. Thank you
                        for your patience
                      </p>
                    </div>
                    <Button
                      className="mt-8 w-full py-4 bg-[#003056]"
                      onClick={handleHome}
                    >
                      Home
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
