import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserType } from "@/types";

interface UserInfo {
  info: UserType | null;
  setInfo: (data: UserType) => void;
  clearInfo: () => void;
  verified: boolean;
  setVerified: (newValue: boolean) => void;
  password: string;
  setPassword: (newValue: string) => void;
  isVerifying: boolean;
  verify: () => void;
  clearVerification: () => void;
}

const useUserInfo = create(
  persist<UserInfo>(
    (set, get) => ({
      info: {
        id: 2,
        fullname: "suraj muhammad",
        email: "soorajwizard01@gmail.com",
        phone: "08082905659",
        password:
          "$2a$10$rQyXwCUS2wbconQiY0DFvOmsCjfCr8hU8Rquj9zy/74Br2OWi95A.",
        pin: null,
        balance: 0,
        image: null,
        status: 1,
        language: "PG",
        isVerified: false,
        createdAt: "2024-11-17T14:41:46.000Z",
        updatedAt: "2024-11-17T14:41:46.000Z",
      },
      setInfo: (data: UserType) => {
        set({ info: data });
      },
      clearInfo: () => {
        set({
          info: null,
        });
      },
      verified: false,
      setVerified: (newValue: boolean) => {
        set({ verified: newValue });
      },
      password: "",
      setPassword: (newValue: string) => {
        set({ password: newValue });
      },
      isVerifying: false,
      verify: () => {
        set({ isVerifying: true });

        const { info, password } = get();

        if (!info || password.length !== 6) {
          set({ isVerifying: false, verified: false });
          return;
        }

        if (password === info.password) {
          set({ verified: true });
        }

        set({ isVerifying: false });
      },
      clearVerification: () => {
        set({ password: "", verified: false, isVerifying: false });
      },
    }),
    {
      name: "fintech-gpt-user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserInfo;
