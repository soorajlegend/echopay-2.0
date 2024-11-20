"use client";

import ConfirmTransaction from "@/components/confirm-transaction";
import EchoListener from "./chat/_components/echo-listener";
import useNewTransaction from "@/hooks/use-new-transaction";
import Echo from "./chat/_components/echo";
import useEcho from "@/hooks/use-echo";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { newTransaction, setNewTransaction } = useNewTransaction();
  const { openEcho, setOpenEcho } = useEcho();
  return (
    <>
      {children}
      {/* <EchoListener /> */}
      <ConfirmTransaction
        data={newTransaction}
        setNewTransaction={setNewTransaction}
      />

      {openEcho && <Echo />}
    </>
  );
}
