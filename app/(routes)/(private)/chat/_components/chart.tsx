"use client";

import React from "react";
import TransactionChart from "./transaction-chart";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export type ChartType = "TRANSACTIONS" | null;

interface ChartProps {
  type: ChartType;
  setType: (value: ChartType) => void;
}

const Chart = ({ type, setType }: ChartProps) => {
  if (type === null) return;

  return (
    <Drawer open onClose={() => setType(null)}>
      <DrawerContent>
        {type === "TRANSACTIONS" && <TransactionChart />}
      </DrawerContent>
    </Drawer>
  );
};

export default Chart;