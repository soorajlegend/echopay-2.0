"use client";

import { BarList } from "@/components/ui/bar-list-chart";
import useTransaction from "@/hooks/use-transaction";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "credit" | "debit";

export const BeneficiaryChart = () => {
  const { transactions } = useTransaction();
  const [filter, setFilter] = useState<FilterType>("all");

  const chartData = useMemo(() => {
    if (!transactions) return [];

    const filteredTransactions = transactions.filter((transaction) => {
      if (filter === "credit") return transaction.amount > 0;
      if (filter === "debit") return transaction.amount < 0;
      return true;
    });

    const beneficiaryGroups = filteredTransactions.reduce(
      (acc, transaction) => {
        const beneficiary = transaction.senderName || "Unknown";
        const amount = Math.abs(transaction.amount);

        if (!acc[beneficiary]) {
          acc[beneficiary] = 0;
        }
        acc[beneficiary] += amount;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(beneficiaryGroups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions, filter]);

  return (
    <div className="min-h-60 flex flex-col gap-y-4">
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "credit" ? "default" : "outline"}
          onClick={() => setFilter("credit")}
        >
          Credit
        </Button>
        <Button
          variant={filter === "debit" ? "default" : "outline"}
          onClick={() => setFilter("debit")}
        >
          Debit
        </Button>
      </div>
      <BarList data={chartData} sortOrder="descending" />
    </div>
  );
};
