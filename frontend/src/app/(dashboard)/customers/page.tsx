"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-slate-400">All resolved customer identities in the system.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Users size={18} /> Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Known Identities</th>
                  <th className="p-3">Churn Score</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-slate-800">
                    <td className="p-3 font-mono text-xs">{c.id}</td>
                    <td className="p-3 text-white font-medium">{c.name || 'Unknown'}</td>
                    <td className="p-3 text-slate-400">{c.identities?.length || 0}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.churnScore > 50 ? 'bg-red-950 text-red-400' : 'bg-green-950 text-green-400'}`}>
                        {c.churnScore}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link href={`/customers/${c.id}`} className="text-blue-400 hover:underline">View Journey</Link>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-slate-500">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
