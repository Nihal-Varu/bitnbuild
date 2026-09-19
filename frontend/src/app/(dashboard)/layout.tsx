import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, GitMerge, Activity, List, Network } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Journey Stitching Platform",
  description: "Cross-Channel Customer Journey Analytics",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Journey Stitching
          </h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Analytics</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem href="/events" icon={<List size={18} />} label="Events" />
          <NavItem href="/customers" icon={<Users size={18} />} label="Customers" />
          <NavItem href="/identities" icon={<Network size={18} />} label="Identity Resolution" />
          <NavItem href="/event-simulator" icon={<Activity size={18} />} label="Event Simulator" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
