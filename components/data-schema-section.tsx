"use client"

import { useState } from "react"

export default function DataSchemaSection() {
  const [activeTab, setActiveTab] = useState("state")

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200 p-1 rounded-lg w-fit mb-6">
        {[
          { id: "state", label: "Agent State", icon: "⚙️" },
          { id: "db", label: "DB Schema", icon: "🗄️" },
          { id: "api", label: "API Interface", icon: "🔌" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {/* Agent State */}
        {activeTab === "state" && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">AgentState (LangGraph)</h3>
                <p className="text-sm text-slate-500">Transient memory during execution.</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-mono">TypedDict</span>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
              <pre className="text-blue-300">
                {`class AgentState(TypedDict):
    # Context
    order_id: str
    customer_tier: str  # ("Gold", "Platinum")
    
    # Risk Data
    risk_score: float
    risk_signals: List[str]  # e.g., ["rider_idle_5m", "rain_surge"]
    
    # Execution History
    messages: List[BaseMessage]  # Chat history with LLM
    actions_taken: List[str]    # e.g., ["checked_status", "reassigned"]
    
    # Outcomes
    resolution_status: str      # "PENDING", "RESOLVED", "ESCALATED"
    cost_incurred: float        # Total value of refunds/coupons`}
              </pre>
            </div>
          </div>
        )}

        {/* DB Schema */}
        {activeTab === "db" && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">PostgreSQL Schema</h3>
                <p className="text-sm text-slate-500">Persistent storage for audit trails.</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-mono">PostgreSQL</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase">Table: agent_executions</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold text-slate-900">Column</th>
                        <th className="p-3 font-semibold text-slate-900">Type</th>
                        <th className="p-3 font-semibold text-slate-900">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">execution_id</td>
                        <td className="p-3 text-slate-600">UUID</td>
                        <td className="p-3 text-slate-500 text-xs">Primary Key</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">order_id</td>
                        <td className="p-3 text-slate-600">VARCHAR</td>
                        <td className="p-3 text-slate-500 text-xs">Foreign Key</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">status</td>
                        <td className="p-3 text-slate-600">ENUM</td>
                        <td className="p-3 text-slate-500 text-xs">RUNNING, SUCCESS, FAILED</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">final_outcome</td>
                        <td className="p-3 text-slate-600">JSONB</td>
                        <td className="p-3 text-slate-500 text-xs">Summary snapshot</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase">Table: agent_actions_log</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold text-slate-900">Column</th>
                        <th className="p-3 font-semibold text-slate-900">Type</th>
                        <th className="p-3 font-semibold text-slate-900">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">id</td>
                        <td className="p-3 text-slate-600">SERIAL</td>
                        <td className="p-3 text-slate-500 text-xs">Primary Key</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">tool_name</td>
                        <td className="p-3 text-slate-600">VARCHAR</td>
                        <td className="p-3 text-slate-500 text-xs">e.g. 'reassign_rider'</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">tool_input</td>
                        <td className="p-3 text-slate-600">JSONB</td>
                        <td className="p-3 text-slate-500 text-xs">Args passed</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-900">tool_output</td>
                        <td className="p-3 text-slate-600">JSONB</td>
                        <td className="p-3 text-slate-500 text-xs">API Result</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Interface */}
        {activeTab === "api" && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Internal API Interface</h3>
                <p className="text-sm text-slate-500">Endpoint called by the Risk Engine.</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-mono">
                POST /v1/agent/trigger
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-600 mb-3 uppercase">Request Body</p>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="font-mono text-xs text-green-300 leading-relaxed">
                    {`{
  "order_id": "ORD-9981",
  "risk_score": 0.85,
  "signals": {
    "rider_idle_time": 320,
    "kitchen_status": "ready"
  }
}`}
                  </pre>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 mb-3 uppercase">Response Body</p>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="font-mono text-xs text-blue-300 leading-relaxed">
                    {`{
  "execution_id": "exec-1234-5678",
  "status": "ACCEPTED"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
