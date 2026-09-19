"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Activity, Send } from "lucide-react";

export default function EventSimulator() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    channel: "WEBSITE",
    eventType: "PRODUCT_VIEW",
    email: "john@gmail.com",
    phone: "",
    customerId: "",
    deviceId: "",
    loyaltyId: "",
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const payload = {
      channel: formData.channel,
      eventType: formData.eventType,
      identifiers: {
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        customerId: formData.customerId || undefined,
        deviceId: formData.deviceId || undefined,
        loyaltyId: formData.loyaltyId || undefined,
      },
      metadata: { source: "simulator" },
      timestamp: new Date().toISOString()
    };

    try {
      // In MVP, backend runs on port 3001
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Event Simulator</h2>
        <p className="text-slate-400">Dispatch test events to demonstrate the Identity Resolution algorithm live.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Activity size={18} /> Simulate Event Payload</CardTitle>
          <CardDescription className="text-slate-400">Events will be sent directly to the backend ingestion queue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Channel</label>
                <select 
                  name="channel" 
                  value={formData.channel} 
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="MOBILE">Mobile App</option>
                  <option value="CALL_CENTER">Call Center</option>
                  <option value="PHYSICAL_STORE">Physical Store</option>
                  <option value="EMAIL">Email</option>
                  <option value="CHAT">Chat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Event Type</label>
                <select 
                  name="eventType" 
                  value={formData.eventType} 
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PRODUCT_VIEW">Product View</option>
                  <option value="ADD_TO_CART">Add To Cart</option>
                  <option value="CHECKOUT_STARTED">Checkout Started</option>
                  <option value="PAYMENT_FAILED">Payment Failed</option>
                  <option value="LOGIN">Login</option>
                  <option value="SUPPORT_CALL">Support Call</option>
                  <option value="ESCALATED">Escalated</option>
                  <option value="REFUND_REQUESTED">Refund Requested</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Available Identifiers</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-1 focus:ring-blue-500" placeholder="john@gmail.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-1 focus:ring-blue-500" placeholder="9999999999" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Customer ID</label>
                  <input name="customerId" value={formData.customerId} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-1 focus:ring-blue-500" placeholder="C001" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Device ID</label>
                  <input name="deviceId" value={formData.deviceId} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-1 focus:ring-blue-500" placeholder="D001" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-950/50 pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">Provide at least one identifier so the system can match the event.</div>
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
              {loading ? "Sending..." : <><Send size={16} className="mr-2" /> Send Event</>}
            </button>
          </CardFooter>
        </form>
      </Card>

      {response && (
        <Card className="bg-slate-900 border-green-900/50">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Server Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-950 p-4 rounded-md text-xs text-green-300 overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
            {response.customerId && (
              <div className="mt-4 text-sm text-slate-300">
                ✅ Event ingested. Identity successfully resolved to Customer <span className="font-mono text-blue-400">{response.customerId}</span>.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
