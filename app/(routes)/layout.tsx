

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div
        className="bg-white dark:bg-gray-900 w-full h-full flex"
      >
        <main className="w-full h-full max-w-lg mx-auto">
          {children}
          </main>
      </div>
  );
}
