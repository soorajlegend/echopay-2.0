"use client";

import React from "react";
import TransactionChart from "./transaction-chart";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useShowChart from "@/hooks/use-show-chart";
import { IncomeVersusSpendingChart } from "./income-versus-spending-chart";
import { BeneficiaryChart } from "./beneficiary-chart";

const Chart = () => {
  const { showChart, setShowChart } = useShowChart();

  // if (showChart === null) return;

  const sample = "BENEFICIARY_CHART";

  return (
    <Drawer open onClose={() => setShowChart(null)}>
      <DrawerContent>
        {showChart === "TRANSACTIONS" && <TransactionChart />}
        {showChart === "INCOME_VS_SPENDING" && <IncomeVersusSpendingChart />}
        {sample === "BENEFICIARY_CHART" && <BeneficiaryChart />}
      </DrawerContent>
    </Drawer>
  );
};

export default Chart;
