"use client";

import ConfirmTransaction from "@/components/confirm-transaction";
import EchoListener from "./chat/_components/echo-listener";
import useNewTransaction from "@/hooks/use-new-transaction";
import Echo from "./chat/_components/echo";
import useEcho from "@/hooks/use-echo";
import Chart from "./chat/_components/charts";
import useShowChart from "@/hooks/use-show-chart";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { newTransaction, setNewTransaction } = useNewTransaction();
  const { openEcho } = useEcho();
  const { showChart } = useShowChart();
  return (
    <>
      {children}
      {/* <EchoListener /> */}
      <ConfirmTransaction
        data={newTransaction}
        setNewTransaction={setNewTransaction}
      />

      {openEcho && <Echo />}
      {showChart && <Chart />}
    </>
  );
}
