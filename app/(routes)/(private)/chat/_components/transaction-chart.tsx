"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useTransaction from "@/hooks/use-transaction";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TransactionChart() {
  const { transactions } = useTransaction();

  const chartData =
    transactions.length > 0
      ? transactions.map((t) => ({
          date: t.date,
          amount: t.isCredit ? t.amount : -t.amount,
        }))
      : [];
  const activeChart = "amount";

  return (
    <Card>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 ? (
          <div className="text-center text-gray-500">
            No transaction data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="amount"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionChart;

// "use client";

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Card, CardContent } from "@/components/ui/card";
// import { transactions } from "@/store";

// const chartData =
//   transactions.length > 0
//     ? transactions.map((t) => ({
//         date: new Date(t.date).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         }),
//         amount: t.isCredit ? t.amount : -t.amount,
//       }))
//     : [];

// const TransactionChart = () => {
//   return (
//     <Card className="bg-white/10 backdrop-blur-lg">
//       <CardContent className="p-6">
//         {chartData.length === 0 ? (
//           <div className="text-center text-gray-500 py-8">
//             No transaction data available
//           </div>
//         ) : (
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//               data={chartData}
//               margin={{
//                 top: 20,
//                 right: 30,
//                 left: 20,
//                 bottom: 5,
//               }}
//             >
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#333"
//                 opacity={0.1}
//               />
//               <XAxis
//                 dataKey="date"
//                 stroke="#888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 stroke="#888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `$${value}`}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "rgba(255, 255, 255, 0.8)",
//                   border: "none",
//                   borderRadius: "8px",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 }}
//                 labelStyle={{ color: "#333" }}
//                 formatter={(value) => [`$${value}`, "Amount"]}
//               />
//               <Bar
//                 dataKey="amount"
//                 fill="#2E2EFF"
//                 radius={[4, 4, 0, 0]}
//                 maxBarSize={50}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TransactionChart;
