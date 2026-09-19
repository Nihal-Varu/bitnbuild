import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, HelpCircle, Activity } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-slate-400">High-level view of your customer journeys and system health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">10</div>
            <p className="text-xs text-slate-500">+10 since last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Journeys</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">10</div>
            <p className="text-xs text-slate-500">Currently in progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <p className="text-xs text-slate-500">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Unresolved Issues</CardTitle>
            <HelpCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1</div>
            <p className="text-xs text-slate-500">No resolution event found</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">High Churn Risk Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-400 text-sm">
              <p className="mb-4">Rule-based churn risk calculation (0-100 score).</p>
              <div className="border border-slate-800 rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Primary Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-800">
                      <td className="p-3">John Smith</td>
                      <td className="p-3"><span className="px-2 py-1 bg-red-950 text-red-400 rounded-full text-xs font-semibold">80</span></td>
                      <td className="p-3 text-slate-500">+25 Refund Request, +15 Escalation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Channel Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-slate-500 border border-slate-800 border-dashed rounded-md bg-slate-950">
              {/* We will add a Recharts BarChart here later */}
              Chart placeholder (Waiting on API)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
