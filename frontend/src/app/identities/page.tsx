"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import Link from "next/link";

export default function IdentitiesPage() {
  const [identities, setIdentities] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/identities")
      .then(res => res.json())
      .then(data => setIdentities(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Identity Mapping</h2>
        <p className="text-slate-400">All raw identifiers captured and stitched by the platform.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Network size={18} /> Global Identity Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Stitched Customer</th>
                  <th className="p-3">First Seen</th>
                </tr>
              </thead>
              <tbody>
                {identities.map((id) => (
                  <tr key={id.id} className="border-t border-slate-800">
                    <td className="p-3 text-indigo-300">{id.type}</td>
                    <td className="p-3 text-white">{id.value}</td>
                    <td className="p-3">
                      <Link href={`/customers/${id.customerId}`} className="text-blue-400 font-mono text-xs hover:underline">
                        {id.customerId}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">{new Date(id.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {identities.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-500">No identities mapped.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
