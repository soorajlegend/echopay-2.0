import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserType } from "@/types";

interface UserInfo {
  info: UserType | null;
  setInfo: (data: UserType | null) => void;
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
      info: null,
      setInfo: (data: UserType | null) => {
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
      name: "echopay-user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserInfo;
