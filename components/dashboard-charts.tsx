"use client"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardCharts() {
  const latencyData = [
    { name: "Ingestion", value: 0.5 },
    { name: "Risk Engine", value: 0.2 },
    { name: "LLM Thinking", value: 12.0 },
    { name: "Tool Execution", value: 5.0 },
    { name: "DB Writes", value: 0.3 },
  ]

  const riskData = [
    { name: "Safe (<0.4)", value: 65 },
    { name: "Monitor (0.4-0.7)", value: 25 },
    { name: "Trigger Risk (>0.7)", value: 10 },
  ]

  const colors = ["#34d399", "#facc15", "#f43f5e"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Latency Budget Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-slate-900">Latency Budget Requirement</h3>
            <p className="text-xs text-slate-500 mt-1">Breakdown of time allocation for the Agent Decision Loop.</p>
          </div>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
            Target: &lt; 30s
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={latencyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} angle={-45} textAnchor="end" height={80} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-slate-900">Risk Trigger Thresholds</h3>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of Order Risk Scores. Only high-risk orders trigger the agent.
            </p>
          </div>
          <span className="text-xs font-mono bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-semibold">
            Trigger &gt; 0.7
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} (${value}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {colors.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
