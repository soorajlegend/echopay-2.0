import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { Beneficiary } from "@/types";

interface VerificationType {
  beneficiaries: Beneficiary[];
  setBeneficiaries: (data: Beneficiary[]) => void;
  addBeneficiary: (data: Beneficiary) => void;
  removeBeneficiary: (id: number) => void;
  clearAll: () => void;
}

const useVerification = create(
  persist<VerificationType>(
    (set, get) => ({
      beneficiaries: [],
      setBeneficiaries: (beneficiaries: Beneficiary[]) => {
        set({ beneficiaries });
      },
      addBeneficiary: (beneficiary: Beneficiary) => {
        const beneficiaries = get().beneficiaries;
        if (beneficiaries.find((current) => current.id === beneficiary.id))
          return;
        set(() => ({
          beneficiaries: [...beneficiaries, beneficiary],
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
      name: "fintech-gpt-beneficiaries-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useVerification;
