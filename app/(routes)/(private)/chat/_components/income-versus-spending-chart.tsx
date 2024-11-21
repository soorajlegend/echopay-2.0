"use client";

import { AreaChart } from "@/components/ui/area-chart";
import useTransaction from "@/hooks/use-transaction";
import React from "react";

interface DailyTotal {
  date: string;
  Credits: number;
  Debits: number;
}

export const IncomeVersusSpendingChart = () => {
  const { transactions } = useTransaction();

  const chartData = React.useMemo(() => {
    // Group transactions by day and calculate totals
    const dailyTotals = transactions.reduce<Record<string, DailyTotal>>(
      (acc, transaction) => {
        const date = new Date(transaction.createdAt);
        const dayFormat = `${date.getDate()} ${date.toLocaleString("default", {
          month: "short",
        })}`;

        if (!acc[dayFormat]) {
          acc[dayFormat] = {
            date: dayFormat,
            Credits: 0,
            Debits: 0,
          };
        }

        if (transaction.isCredit) {
          acc[dayFormat].Credits += transaction.amount;
        } else {
          acc[dayFormat].Debits += transaction.amount;
        }

        return acc;
      },
      {}
    );

    // Convert to array and sort by date
    const sortedData = Object.values(dailyTotals).sort((a, b) => {
      const dateA = new Date(a.date + " " + new Date().getFullYear());
      const dateB = new Date(b.date + " " + new Date().getFullYear());
      return dateA.getTime() - dateB.getTime();
    });

    // Ensure first and last labels are always visible
    if (sortedData.length > 0) {
      sortedData[0].date = "📅 " + sortedData[0].date;
      sortedData[sortedData.length - 1].date =
        "📅 " + sortedData[sortedData.length - 1].date;
    }

    return sortedData;
  }, [transactions]);

  return (
    <div className="flex flex-col gap-4 py-4 px-2 lg:px-5">
      <p className="mx-auto font-mono text-sm font-medium">
        Income vs Spending (Daily)
      </p>
      <AreaChart
        className="h-72"
        data={chartData}
        index="date"
        categories={["Credits", "Debits"]}
        colors={["emerald", "pink"]}
        showLegend={true}
        showGridLines={true}
        startEndOnly={true}
        valueFormatter={(number: number) =>
          `₦${Intl.NumberFormat("en-US").format(number).toString()}`
        }
      />
    </div>
  );
};
