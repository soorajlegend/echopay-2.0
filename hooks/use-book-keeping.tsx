import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { BookKeeping } from "@/types";

interface BookKeepingType {
  records: BookKeeping[];
  setRecords: (data: BookKeeping[]) => void;
  addRecord: (data: BookKeeping) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
}

const useBookKeeping = create(
  persist<BookKeepingType>(
    (set, get) => ({
      records: [],
      setRecords: (records: BookKeeping[]) => {
        set({ records });
      },
      addRecord: (record: BookKeeping) => {
        const records = get().records;
        set(() => ({
          records: [record, ...records],
        }));
      },
      deleteRecord: (id: string) => {
        const records = get().records;
        const filteredRecords = records.filter(
          (record: BookKeeping) => record.id !== id
        );
        set({ records: filteredRecords });
        toast.success("Record deleted successfully");
      },
      clearAll: () => {
        set({
          records: [],
        });
      },
    }),
    {
      name: "echopay-bookkeeping-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBookKeeping;
