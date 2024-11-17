import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { Beneficiary } from "@/types";

interface BeneficiaryType {
  beneficiaries: Beneficiary[];
  setBeneficiaries: (data: Beneficiary[]) => void;
  addBeneficiary: (data: Beneficiary) => void;
  removeBeneficiary: (id: number) => void;
  clearAll: () => void;
}


const useBeneficiary = create(
  persist<BeneficiaryType>(
    (set, get) => ({
      beneficiaries: [
        {
          id: 1,
          userid: "2",
          acc_name: "Faruq Hassan",
          acc_num: "08114528984",
          bank_name: "",
          bank_code: "",
          status: 0,
          createdAt: "2024-11-17T15:14:46.000Z",
          updatedAt: "2024-11-17T15:14:46.000Z",
        },
        {
          id: 3,
          userid: "user2",
          acc_name: "Salma Gambo",
          acc_num: "0987654321",
          bank_name: "Chase Bank",
          bank_code: "CHASE001",
          status: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 4,
          userid: "user3",
          acc_name: "Muhammad Ali",
          acc_num: "5555555555",
          bank_name: "Wells Fargo",
          bank_code: "WF001",
          status: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ],
      setBeneficiaries: (beneficiaries: Beneficiary[]) => {
        set({ beneficiaries });
      },
      addBeneficiary: (beneficiary: Beneficiary) => {
        const beneficiaries = get().beneficiaries;
        if (beneficiaries.find((current) => current.id === beneficiary.id))
          return;
        set(() => ({
          beneficiaries: [beneficiary, ...beneficiaries],
        }));
      },
      removeBeneficiary: (id: number) => {
        const beneficiaries = get().beneficiaries;
        const filteredBeneficiaries = beneficiaries.filter(
          (beneficiary: Beneficiary) => beneficiary.id !== id
        );
        set({ beneficiaries: filteredBeneficiaries });
        toast.success("Beneficiary deleted successfully");
      },
      clearAll: () => {
        set({
          beneficiaries: [],
        });
      },
    }),
    {
      name: "echopay-beneficiaries-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBeneficiary;
