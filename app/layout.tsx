import "./globals.css";

import Link from "next/link";

import {
  LayoutDashboard,
  Plane,
  Activity,
  Wrench,
  BookOpen, 
  Bell,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "SIMHARPES",
  description: "Sistem Informasi Monitoring Pemeliharaan Pesawat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body className="bg-[#0B1120] text-white">

        <main className="min-h-screen flex">

          {/* Sidebar */}
          <aside className="w-72 bg-[#111827] border-r border-gray-800 p-6">

            <h1 className="text-3xl font-bold text-cyan-400 mb-12">
              SIMHARPES
            </h1>

            <nav className="space-y-6 text-gray-300">

              <Link
                href="/"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>

              <Link
                href="/aircraft"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <Plane size={20} />
                Aircraft
              </Link>

              <Link
                href="/staggering"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <Activity size={20} />
                Staggering
              </Link>

              <Link
                href="/maintenance"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <Wrench size={20} />
                Maintenance
              </Link>

              <Link
                href="/logbook"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <BookOpen size={20} />
                Logbook
              </Link>

              <Link
                href="/certificates"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <ShieldCheck size={20} />
                Certificates
              </Link>

              <Link
                href="/notifications"
                className="flex items-center gap-3 hover:text-cyan-400"
              >
                <Bell size={20} />
                Notifications
              </Link>

            </nav>

          </aside>

          {/* Main Content */}
          <section className="flex-1 p-8">
            {children}
          </section>

        </main>

      </body>

    </html>
  );
}
