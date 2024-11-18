import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserType } from "@/types";

interface EchoSetupType {
  openEcho: boolean;
  setOpenEcho: (value: boolean) => void;
}

const useEcho = create<EchoSetupType>((set) => ({
  openEcho: false,
  setOpenEcho: (value: boolean) => {
    set({ openEcho: value });
  },
}));

export default useEcho;