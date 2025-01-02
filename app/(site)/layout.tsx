export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
      <div className="h-full rounded-md  p-2">
        <div className="p-2">{children}</div>
      </div>
    </main>
  );
}
