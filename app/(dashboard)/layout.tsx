import { Navbar } from "@/components/dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <footer className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        University of Arkansas - CSCE Capstone 2025
      </footer>
    </div>
  );
}
