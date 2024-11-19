import EchoListener from "./chat/_components/echo-listener";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {/* <EchoListener /> */}
    </>
  );
}
