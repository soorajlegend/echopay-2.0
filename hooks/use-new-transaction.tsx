import { NewTransactionType } from "@/types";
import { create } from "zustand";

interface NewTransactionPropsType {
  newTransaction: NewTransactionType | null;
  setNewTransaction: (value: NewTransactionType | null) => void;
}

const useNewTransaction = create<NewTransactionPropsType>((set) => ({
  newTransaction: null,
  setNewTransaction: (value: NewTransactionType | null) => {
    set({ newTransaction: value });
  },
}));

export default useNewTransaction;
