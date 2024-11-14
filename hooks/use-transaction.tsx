import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { Transaction } from '@/types';



interface TransactionType {
  transactions: Transaction[];
  setTransactions: (data: Transaction[]) => void;
  addTransaction: (data: Transaction) => void;
  deleteTransaction: (id: number) => void;
  clearAll: () => void;
}

const useTransaction = create(
  persist<TransactionType>(
    (set, get) => ({
      transactions: [],
      setTransactions: (transactions: Transaction[]) => {
        set({ transactions });
      },
      addTransaction: (transaction: Transaction) => {
        const transactions = get().transactions;
        set(() => ({
          transactions: [transaction, ...transactions],
        }));
      },
      deleteTransaction: (id: number) => {
        const transactions = get().transactions;
        const filteredTransactions = transactions.filter(
          (transaction: Transaction) => transaction.id !== id
        );
        set({ transactions: filteredTransactions });
        toast.success("Transaction deleted successfully");
      },
      clearAll: () => {
        set({
          transactions: [],
        });
      },
    }),
    {
      name: "fintech-gpt-transactions-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTransaction;
