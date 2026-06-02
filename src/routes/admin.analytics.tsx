import { createFileRoute } from "@tanstack/react-router";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const data = Array.from({ length: 30 }).map((_, i) => ({ d: i + 1, visitors: 800 + Math.round(Math.sin(i / 3) * 200 + i * 18), conv: 2 + Math.sin(i / 4) * 0.6 }));
export const Route = createFileRoute("/admin/analytics")({ component: Analytics });
function Analytics() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border bg-card">
          <div className="font-display text-xl mb-2">Visitors · 30 days</div>
          <div className="h-72"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="d" stroke="currentColor" fontSize={11} /><YAxis stroke="currentColor" fontSize={11} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} /><Line dataKey="visitors" stroke="var(--gold)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
        </div>
        <div className="p-6 rounded-2xl border bg-card">
          <div className="font-display text-xl mb-2">Conversion %</div>
          <div className="h-72"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="d" stroke="currentColor" fontSize={11} /><YAxis stroke="currentColor" fontSize={11} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} /><Line dataKey="conv" stroke="var(--primary)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
        </div>
      </div>
    </div>
  );
}
