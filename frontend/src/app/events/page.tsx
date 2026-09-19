"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Event Log</h2>
        <p className="text-slate-400">All incoming cross-channel events.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><List size={18} /> Event Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Resolved To</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-slate-800">
                    <td className="p-3 text-slate-400">{new Date(e.timestamp).toLocaleString()}</td>
                    <td className="p-3"><span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">{e.channel}</span></td>
                    <td className="p-3 text-white font-medium">{e.eventType}</td>
                    <td className="p-3">
                      <Link href={`/customers/${e.customerId}`} className="text-blue-400 font-mono text-xs hover:underline">
                        {e.customerId}
                      </Link>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-500">No events recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
