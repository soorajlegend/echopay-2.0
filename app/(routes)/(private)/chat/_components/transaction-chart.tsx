"use client";

import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { transactions } from "@/store";

interface TransactionChartProps {
  chartType: "line" | "bar";
}

export const TransactionChart = ({ chartType }: TransactionChartProps) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = sortedTransactions.map(t => ({
    date: t.date,
    amount: t.isCredit ? t.amount : -t.amount,
  }));

  return (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center p-2 md:p-4 bg-white rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#003056" />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#003056" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
