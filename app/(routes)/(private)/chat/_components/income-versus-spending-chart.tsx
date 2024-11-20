"use client";

import { AreaChart } from "@/components/ui/area-chart";
import useTransaction from "@/hooks/use-transaction";
import React from "react";

interface MonthlyTotal {
  date: string;
  Credits: number;
  Debits: number;
}

export const IncomeVersusSpendingChart = () => {
  const { transactions } = useTransaction();

  const chartData = React.useMemo(() => {
    // Group transactions by month and calculate totals
    const monthlyTotals = transactions.reduce<Record<string, MonthlyTotal>>(
      (acc, transaction) => {
        const date = new Date(transaction.createdAt);
        const monthYear = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear().toString().slice(2)}`;

        if (!acc[monthYear]) {
          acc[monthYear] = {
            date: monthYear,
            Credits: 0,
            Debits: 0,
          };
        }

        if (transaction.isCredit) {
          acc[monthYear].Credits += transaction.amount;
        } else {
          acc[monthYear].Debits += transaction.amount;
        }

        return acc;
      },
      {}
    );

    // Convert to array and sort by date
    return Object.values(monthlyTotals).sort((a, b) => {
      const [aMonth, aYear] = a.date.split(" ");
      const [bMonth, bYear] = b.date.split(" ");
      return (
        new Date(`${aMonth} 20${aYear}`).getTime() -
        new Date(`${bMonth} 20${bYear}`).getTime()
      );
    });
  }, [transactions]);

  return (
    <div className="flex flex-col gap-4">
      <p className="mx-auto font-mono text-sm font-medium">
        Income vs Spending
      </p>
      <AreaChart
        className="h-72"
        data={chartData}
        index="date"
        categories={["Credits", "Debits"]}
        colors={["emerald", "pink"]}
        showLegend={true}
        valueFormatter={(number: number) =>
          `₦${Intl.NumberFormat("en-US").format(number).toString()}`
        }
      />
    </div>
  );
};
