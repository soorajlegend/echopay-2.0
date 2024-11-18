"use client";
import React from 'react'
import { useState } from "react"
import ConfirmTransaction from '@/components/ui/confirm-transaction';
import TransactionInput from '@/components/ui/transaction-input';
import SlideContainer from '@/components/slide-container';
import axios from 'axios';
import { Link } from 'lucide-react';


const TransactionPage = () => {
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [stage, setStage] = useState(1);
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");

 
    const handleConfirm = () => {
        if (!selectedBank || !accountNumber || !amount) {
          alert("Please fill in all fields.");
          return;
        }
        setStage(2);
      };

      //"https://echo-pay.onrender.com/api/transfer",
      const handlePinSubmit = async (inputPin: string) => {
        if (inputPin.length !== 5) {
          alert("PIN must be 5 digits.");
          return;
        }
        setPin(inputPin);
        setIsLoading(true);
        setErrorMessage("");

        const payload = {
            sender: "YourSenderIdentifier", // actual sender info
            receiver: accountNumber,
            amount: parseFloat(amount),
            narration: `Transfer to ${selectedBank}`,
            pin: parseInt(inputPin, 10),
          };
    
        // Call the API with the payload
        try {
            const response = await axios.post("https://echo-pay.onrender.com/api/transfer", payload);

            if (response.data.success) {
                setTransactionStatus("Transaction Successful!");
                setStage(3);
              } else {
                setErrorMessage(response.data.message || "Transaction Failed.");
                setIsLoading(false);
              }
        } catch (error) {
            setErrorMessage("Transaction Failed.");
            setIsLoading(false) ;
        }
      };
  
  return (
    <div className='p-6 h-screen flex items-center justify-center'>
        {/* stages === 1 */}
        {stage === 1 && (
          <SlideContainer custom={stage}>
            <ConfirmTransaction
              selectedBank={selectedBank}
              accountNumber={accountNumber}
              amount={amount}
              onBankSelect={setSelectedBank}
              onAccountChange={setAccountNumber}
              onAmountChange={setAmount}
              onContinue={handleConfirm}
            />
          </SlideContainer>
        )}
        {/* stages === 2 */}
        {stage === 2 && (
          <SlideContainer custom={stage}>
            <TransactionInput
              onContinue={handlePinSubmit}
              value={pin}
              setPin={setPin}
              isLoading={isLoading}
              error=""
            />
          </SlideContainer>
        )}
        {stage === 3 && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              {isLoading ? "Processing..." : "Transaction Successful!"}
            </h2>
            <p>Amount: {amount}</p>
            <p>Account Number: {accountNumber}</p>
            <p>Bank: {selectedBank}</p>
          </div>
        )}
        </div>
  )
}

export default TransactionPage