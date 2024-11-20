import { create } from "zustand";
export type ChartType = "TRANSACTIONS" | null;

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
