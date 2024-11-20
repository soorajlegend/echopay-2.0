"use client"

import { TTS } from '@/actions/voice';
import useBeneficiary from '@/hooks/use-beneficiary';
import useChat from '@/hooks/use-chat';
import useTransaction from '@/hooks/use-transaction';
import useUserInfo from '@/hooks/use-userinfo';
import { completeJsonStructure, isValidJson } from '@/lib/utils';
import { NewTransactionType } from '@/types';
import { AudioLinesIcon, Mic, Pause, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ChatStructure, EchoVoiceChat } from '@/actions/voice-chat';
import ConfirmTransaction from '@/components/confirm-transaction';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import useEcho from '@/hooks/use-echo';


declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const VoiceRecorder = () => {

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingCompleted, setRecordingCompleted] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [unSavedPrompt, setUnSavedPrompt] = useState("");
  const [stream, setStream] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [newTransaction, setNewTransaction] = useState<NewTransactionType | null>(null);



  const { chats, addChat } = useChat()
  const { beneficiaries } = useBeneficiary()
  const { transactions } = useTransaction()
  const { info } = useUserInfo()
  const { openEcho, setOpenEcho } = useEcho();

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);


  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (newTransaction) return;
      audioElement.addEventListener('ended', startRecording);

      // Clean up the event listener on component unmount
      return () => {
        audioElement.removeEventListener('ended', startRecording);
      };
    }
  }, [audioRef.current?.src]);



  // const handleAudioEnded = () => {
  //   // setIsSpeaking(false)
  //   startRecording()
  // };


  const startRecording = () => {
    setIsRecording(true);
    setIsSpeaking(false)


    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Your browser does not support speech recognition.');
      setIsRecording(false);
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setTranscript(transcript);
    };

    recognitionRef.current.stop();

    recognitionRef.current.onend = () => {
      // Restart the recognition if it stops unexpectedly
      if (isRecording) {
        recognitionRef.current.start();
      }
    };


    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      handlePrompt()
      setIsRecording(false);
      setRecordingCompleted(true);
      recognitionRef.current.stop();
    }
  }

  const stopChat = () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  }


  const speakTheNewMessage = async (newMessage: string) => {
    setIsSpeaking(true)
    const speechFile = await TTS(newMessage)
    if (audioRef.current) {
      audioRef.current.src = speechFile;
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      setTranscript('')
    }
  }





    const handlePrompt = async () => {
        if (!transcript) return

        setIsStreaming(true);

        const filteredPrompt = transcript;
        setUnSavedPrompt(filteredPrompt);

        const messages: ChatStructure[] = [
            ...[...chats].map((chat) => ({
            role:
                chat.role === "user"
                ? "user"
                : ("assistant" as "user" | "assistant"),
            content: `${chat.content}`,
            })),
            {
            role: "user",
            content: filteredPrompt,
            },
        ];

        const data = {
            messages,
            beneficiaries: JSON.stringify(
            beneficiaries?.map(
                (b) => `${b?.acc_name || ""} - ${b?.id || ""} |`
            ) || []
            ),
            transactions: JSON.stringify(
            transactions?.map((t) => {
                if (!t) return "";
                return `${t.isCredit ? t.senderName : t.receiverName} - ${
                t.isCredit ? "Credit" : "Debit"
                } - NGN${t.amount} - ${t.date} |`;
            }) || []
            ),
            name: info?.fullname || "",
            balance: Number(info?.balance) || 0,
        };

        const response = await EchoVoiceChat(data);

        if(response){
            setIsStreaming(false)
            const jsonData = JSON.parse(response) 
        
            speakTheNewMessage(jsonData.message)

            if (jsonData.newTransaction) {
                setNewTransaction(jsonData.newTransaction)
            }

            addChat({
                id: uuidv4(),
                role: "user",
                content: unSavedPrompt,
                createdAt: new Date()
            })

            addChat({
                id: uuidv4(),
                role: "assistant",
                content: jsonData.message,
                createdAt: new Date()
            })
        }

    }

  return (
    <Drawer open={openEcho} onClose={() => setOpenEcho(false)}>
      <DrawerContent className="min-h-[60%] w-full">
      <div className="w-full">
        {(isRecording || transcript) && (
          <div className="w-full">
            {/* <div className="flex-1 flex w-full justify-between">
              <div className="gap-y-1">
                <p className="text-sm font-medium leading-none">
                  {recordingCompleted ? "Recorded" : "Recording"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {recordingCompleted ? "thanks for talking" : "start speaking"}
                </p>
              </div>

              

              {isRecording && (
                <div className="rounded-full w-4 h-4  bg-rose-500 animate-pulse" />
              )}
            </div> */}

            {/* {transcript && (
              <div className="border rounded-md p-3 h-full mt-4">
                <p className='mt-0'>{transcript}</p>
              </div>
            )} */}
          </div>
        )}

        {/* Button section */}
        <div className="flex items-center w-full ">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className='rounded-full mt-10 m-auto flex items-center justify-center '
            >
              <span className='recording animate-bounce m-auto'></span>
            </button>
          ) : (
            <>
              {(isSpeaking || isStreaming) ? (
                <button
                  onClick={startRecording}
                  className='w-full h-full flex items-center justify-center'
                >
                  <span className='speaking animate-bounce' />
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className='rounded-full w-20 h-20 mt-10 m-auto flex items-center justify-center bg-main'
                >
                  <AudioLinesIcon className="text-white w-10 h-10" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {(isRecording || isSpeaking || isSpeaking) && <button
          onClick={stopChat}
          className='fixed bottom-5 mx-auto rounded-full w-20 h-20 mt-10 m-auto flex items-center justify-center bg-rose-600'
        >
          <X className="text-white w-10 h-10" />
        </button>
      }


      {/* <Recorder uploadAudio={uploadAudio} /> */}

      <audio
        ref={audioRef}
        controls
        // onEnded={handleAudioEnded}
        hidden
        className='sr-only'
      />

      {/* <form>
        <input
          type="file"
          name="audio"
          hidden
          ref={fileRef}
           />
           <button 
           type='submit'
           hidden 
           ref={uploadButtonRef} />
      </form> */}

      <ConfirmTransaction
        data={newTransaction}
        setNewTransaction={setNewTransaction}
      />
    </div>
    </DrawerContent>
    </Drawer>
  );
};

export default VoiceRecorder;