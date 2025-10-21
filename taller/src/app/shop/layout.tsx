export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
        {children}
        <h1 className="bg-red-500">Shop Page</h1>
    </main>
  );
}
