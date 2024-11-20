import { create } from "zustand";
export type ChartType = "TRANSACTIONS" | "INCOME_VS_SPENDING" | "BENEFICIARY_CHART" | null;

interface ShowChartPropsType {
  showChart: ChartType;
  setShowChart: (value: ChartType) => void;
}

const useShowChart = create<ShowChartPropsType>((set) => ({
  showChart: null,
  setShowChart: (value: ChartType) => {
    set({ showChart: value });
  },
}));

export default useShowChart;
