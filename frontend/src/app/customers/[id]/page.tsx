"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, History, Smartphone, Globe, HeadphonesIcon, Store } from "lucide-react";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [journey, setJourney] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, journRes] = await Promise.all([
          fetch(`/api/customers`),
          fetch(`/api/customers/${id}/journey`)
        ]);
        const customers = await custRes.json();
        const j = await journRes.json();
        
        setCustomer(customers.find((c: any) => c.id === id));
        setJourney(j);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!customer) return <div className="text-white p-8">Customer not found.</div>;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WEBSITE': return <Globe size={16} />;
      case 'MOBILE': return <Smartphone size={16} />;
      case 'CALL_CENTER': return <HeadphonesIcon size={16} />;
      case 'PHYSICAL_STORE': return <Store size={16} />;
      default: return <Globe size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight uppercase">{customer.name || 'Unknown User'}</h2>
        <p className="text-slate-400">Customer ID: {customer.id}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Network size={18} /> Identity Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm text-slate-300 bg-slate-950 p-4 rounded-md border border-slate-800">
              <div className="text-blue-400 font-bold mb-2">{customer.name}</div>
              {customer.identities?.map((ident: any, i: number) => (
                <div key={ident.id} className="flex items-center gap-2 mb-1">
                  <span className="text-slate-600">├──</span>
                  <span className="text-indigo-300 w-24">{ident.type}</span>
                  <span className="text-slate-200">{ident.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              This demonstrates how identities from different systems are mapped to this single customer record.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><History size={18} /> Unified Journey Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journey.map((event: any, i: number) => (
              <div key={event.id} className="flex gap-4 relative">
                {/* Timeline line */}
                {i !== journey.length - 1 && (
                  <div className="absolute top-8 left-4 bottom-[-16px] w-0.5 bg-slate-800"></div>
                )}
                
                <div className="z-10 bg-slate-950 border border-slate-700 p-2 rounded-full h-8 w-8 flex items-center justify-center text-slate-400">
                  {getChannelIcon(event.channel)}
                </div>
                
                <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-400">{event.eventType}</span>
                    <span className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{event.channel}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800/50">
                    Event ID: {event.id}
                  </div>
                </div>
              </div>
            ))}
            {journey.length === 0 && (
              <div className="text-slate-500 text-center py-4">No events found for this customer yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
