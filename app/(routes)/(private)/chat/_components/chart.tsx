"use client";

import React from "react";
import TransactionChart from "./transaction-chart";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useShowChart, { ChartType } from "@/hooks/use-show-chart";

const Chart = () => {
  const { showChart, setShowChart } = useShowChart();

  if (showChart === null) return;

  return (
    <Drawer open onClose={() => setShowChart(null)}>
      <DrawerContent>
        {showChart === "TRANSACTIONS" && <TransactionChart />}
      </DrawerContent>
    </Drawer>
  );
};

export default Chart;
