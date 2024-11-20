"use client";

import React from "react";
import TransactionChart from "./transaction-chart";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useShowChart, { ChartType } from "@/hooks/use-show-chart";
import { IncomeVersusSpendingChart } from "./income-versus-spending-chart";

const Chart = () => {
  const { showChart, setShowChart } = useShowChart();

  // if (showChart === null) return;

  const sample = "INCOME_VS_SPENDING";

  return (
    <Drawer open onClose={() => setShowChart(null)}>
      <DrawerContent>
        {showChart === "TRANSACTIONS" && <TransactionChart />}
        {sample === "INCOME_VS_SPENDING" && <IncomeVersusSpendingChart />}
      </DrawerContent>
    </Drawer>
  );
};

export default Chart;
