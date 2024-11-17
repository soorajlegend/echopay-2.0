"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { transactions } from "@/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const TransactionChart = () => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Only show first and last date
  const firstDate = sortedTransactions[0].date;
  const lastDate = sortedTransactions[sortedTransactions.length - 1].date;

  const labels = [firstDate, lastDate];
  const amounts = [
    sortedTransactions[0].isCredit
      ? sortedTransactions[0].amount
      : -sortedTransactions[0].amount,
    sortedTransactions[sortedTransactions.length - 1].isCredit
      ? sortedTransactions[sortedTransactions.length - 1].amount
      : -sortedTransactions[sortedTransactions.length - 1].amount,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Transaction Amount",
        data: amounts,
        borderColor: "#003056",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: window.innerWidth > 768,
      },
      title: {
        display: true,
        text: "Transaction History",
        font: {
          size: window.innerWidth < 768 ? 14 : 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: window.innerWidth > 768,
          text: "Amount (₦)",
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      x: {
        title: {
          display: window.innerWidth > 768,
          text: "Date",
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center p-2 md:p-4 bg-white rounded-lg shadow">
      <Line
        options={options}
        data={{
          ...data,
          datasets: [
            {
              ...data.datasets[0],
              borderColor: "#003056",
            },
          ],
        }}
      />
    </div>
  );
};

export default TransactionChart;
