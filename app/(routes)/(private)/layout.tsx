import Assistant from "@/app/(routes)/(private)/voice/_components/assistant-drawer";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Assistant />
    </>
  );
}
