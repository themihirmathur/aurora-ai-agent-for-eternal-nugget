"use client"

import { useState } from "react"

const archDetails = {
  signals: {
    icon: "📡",
    title: "Signal Ingestion Layer",
    content:
      "Ingests real-time events such as rider_location_update, kitchen_prep_delay, and traffic_surge. These raw signals form the basis of risk detection.",
    tags: ["Kafka Topics: order.events", "rider.telemetry"],
  },
  kafka: {
    icon: "📨",
    title: "Event Bus (Kafka)",
    content:
      "Acts as the central nervous system, decoupling signal producers from the risk engine. Ensures high throughput and reliable delivery of events.",
    tags: ["Apache Kafka", "Event Driven"],
  },
  risk: {
    icon: "⚡",
    title: "Risk Engine",
    content:
      'Deterministic rule engine or ML model. Calculates a dynamic risk_score (0.0 - 1.0) based on incoming signals. Pushes a "risk_alert" if score > 0.7.',
    tags: ["Threshold: > 0.7", "Output: risk_alert"],
  },
  orchestrator: {
    icon: "🤖",
    title: "Agent Orchestrator Service",
    content:
      'The "Brain" of the system. Receives alerts, initializes AgentState, and runs the Plan-Act-Reflect loop. Manages multi-turn logic.',
    tags: ["Python (FastAPI)", "LangGraph", "Redis"],
  },
  llm: {
    icon: "🧠",
    title: "LLM Provider",
    content:
      "Provides the reasoning capabilities. Recommended: gpt-4o-mini for speed/cost balance, falling back to gpt-4o for complex reasoning.",
    tags: ["OpenAI", "Azure"],
  },
  tool_logistics: {
    icon: "🚚",
    title: "Tool: Logistics Service",
    content: "Internal microservice wrapper. Allows the agent to query nearby riders and execute reassignment orders.",
    tags: ["Function: reassign_rider"],
  },
  tool_comms: {
    icon: "💬",
    title: "Tool: Comms Service",
    content:
      "Handles outgoing messages to customers via WhatsApp or In-App notifications. Used to proactively inform users of delays.",
    tags: ["Function: notify_customer"],
  },
  tool_order: {
    icon: "💰",
    title: "Tool: Order Service",
    content: "Manages financial transactions. Used to issue refunds or coupons as compensation for bad experiences.",
    tags: ["Function: issue_refund", "Idempotency Required"],
  },
}

const ArrowConnector = ({ direction = "down", active = false }: { direction?: "down" | "right"; active?: boolean }) => {
  const baseClass =
    direction === "down"
      ? "absolute -bottom-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-slate-300 to-slate-200"
      : "absolute top-1/2 -right-12 h-0.5 w-12 bg-gradient-to-r from-slate-300 to-slate-200 -translate-y-1/2"

  const arrowClass =
    direction === "down"
      ? "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-slate-300"
      : "absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-l-2 border-t-transparent border-b-transparent border-l-slate-300"

  return (
    <div className={baseClass}>
      <div className={`${arrowClass} transition-all duration-300 ${active ? "opacity-100" : "opacity-60"}`} />
    </div>
  )
}

const ComponentButton = ({
  id,
  label,
  subtitle,
  icon,
  color,
  showArrowDown = false,
  showArrowRight = false,
  setSelectedComponent,
  selectedComponent,
}: {
  id: string
  label: string
  subtitle: string
  icon: string
  color: string
  showArrowDown?: boolean
  showArrowRight?: boolean
  setSelectedComponent: any
  selectedComponent: any
}) => (
  <div className="relative group">
    <button
      onClick={() => setSelectedComponent(id)}
      className={`w-36 p-4 rounded-lg shadow text-center cursor-pointer transition-all duration-300 ${color} border-2 ${
        selectedComponent === id
          ? "border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105"
          : "border-transparent hover:border-slate-400 hover:shadow-md hover:scale-102"
      }`}
    >
      <div className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <div className="font-bold text-sm text-slate-900">{label}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </button>
    {showArrowDown && <ArrowConnector direction="down" active={selectedComponent === id} />}
    {showArrowRight && <ArrowConnector direction="right" active={selectedComponent === id} />}
  </div>
)

export default function ArchitectureSection() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const detail = selectedComponent ? archDetails[selectedComponent as keyof typeof archDetails] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Interactive Diagram */}
      <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-8 min-h-[550px] relative flex flex-col justify-between select-none">
        {/* Top Row: Signals & Ingestion */}
        <div className="flex justify-center gap-8 mb-12 relative">
          <ComponentButton
            id="signals"
            label="Signals"
            subtitle="Order/Rider Events"
            icon="📡"
            color="bg-white"
            showArrowRight
            setSelectedComponent={setSelectedComponent}
            selectedComponent={selectedComponent}
          />
          <ComponentButton
            id="kafka"
            label="Kafka"
            subtitle="Event Bus"
            icon="📨"
            color="bg-white"
            showArrowRight
            setSelectedComponent={setSelectedComponent}
            selectedComponent={selectedComponent}
          />
          <ComponentButton
            id="risk"
            label="Risk Engine"
            subtitle="The Trigger"
            icon="⚡"
            color="bg-rose-50 border-rose-200"
            showArrowDown
            setSelectedComponent={setSelectedComponent}
            selectedComponent={selectedComponent}
          />
        </div>

        {/* Middle Row: Agent Core */}
        <div className="flex justify-center gap-8 mb-12 relative">
          {/* Top connector line from risk engine */}
          <div className="absolute -top-16 left-1/2 w-0.5 h-16 bg-gradient-to-b from-slate-300 to-slate-200" />

          <div className="relative group">
            <button
              onClick={() => setSelectedComponent("llm")}
              className={`w-32 p-3 rounded-lg shadow text-center cursor-pointer transition-all duration-300 bg-indigo-50 border-indigo-200 border-2 ${
                selectedComponent === "llm"
                  ? "border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105"
                  : "hover:border-slate-400 hover:shadow-md hover:scale-102"
              }`}
            >
              <div className="text-xl mb-1 transition-transform duration-300 group-hover:scale-110">🧠</div>
              <div className="font-bold text-xs text-slate-900">LLM</div>
              <div className="text-[10px] text-slate-500">OpenAI/Azure</div>
            </button>
            {/* Left connector from LLM to Orchestrator */}
            <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 -translate-y-1/2" />
          </div>

          <div className="relative group">
            <button
              onClick={() => setSelectedComponent("orchestrator")}
              className={`w-56 p-6 rounded-lg shadow text-center cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 border-2 ${
                selectedComponent === "orchestrator"
                  ? "border-blue-600 ring-2 ring-blue-300 shadow-xl scale-105"
                  : "hover:border-blue-400 hover:shadow-md hover:scale-102"
              }`}
            >
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">🤖</div>
              <div className="font-bold text-slate-900">Agent Orchestrator</div>
              <div className="text-xs text-slate-500">LangGraph Service</div>
              <div className="text-[10px] text-blue-600 mt-1 font-mono font-bold">ReAct Loop</div>
            </button>
            {/* Down connector from Orchestrator to Tools */}
            <ArrowConnector direction="down" active={selectedComponent === "orchestrator"} />
          </div>
        </div>

        {/* Bottom Row: Tools */}
        <div className="flex justify-center gap-6 relative">
          {/* Top connector line spreading to tools */}
          <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-gradient-to-b from-slate-300 to-slate-200" />
          <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 w-full justify-center">
            <div className="w-1/2 h-0.5 bg-gradient-to-r from-slate-200 to-slate-300" />
          </div>

          {[
            { id: "tool_logistics", label: "Logistics SVC", subtitle: "Reassign", icon: "🚚" },
            { id: "tool_comms", label: "Comms SVC", subtitle: "Notify", icon: "💬" },
            { id: "tool_order", label: "Order SVC", subtitle: "Refund", icon: "💰" },
          ].map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setSelectedComponent(item.id)}
                className={`w-32 p-3 rounded-lg shadow text-center cursor-pointer transition-all duration-300 bg-white border-2 ${
                  selectedComponent === item.id
                    ? "border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105"
                    : "border-transparent hover:border-slate-400 hover:shadow-md hover:scale-102"
                }`}
              >
                <div className="text-xl mb-1 transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                <div className="font-bold text-xs text-slate-900">{item.label}</div>
                <div className="text-[10px] text-slate-500">{item.subtitle}</div>
              </button>
              {/* Vertical connector from main line to each tool */}
              <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-gradient-to-b from-slate-300 to-slate-200 -translate-x-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="bg-slate-900 rounded-xl p-6 text-slate-100 shadow-xl h-fit sticky top-24 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700 transition-all duration-300">
          <div className="text-3xl transition-transform duration-300 group-hover:scale-110">{detail?.icon || "ℹ️"}</div>
          <div>
            <h3 className="font-bold text-lg">{detail?.title || "Component Details"}</h3>
            <p className="text-slate-400 text-xs uppercase tracking-wider">{detail ? "Specs" : "Select a block"}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {detail ? (
            <p className="text-slate-300 leading-relaxed text-sm animate-in fade-in duration-300">{detail.content}</p>
          ) : (
            <p className="text-slate-400 italic text-sm">
              Click any component in the diagram to see its role, technology stack, and data flow details.
            </p>
          )}
        </div>

        {detail && (
          <div className="pt-4 border-t border-slate-700 animate-in fade-in duration-300">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {detail.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-800 rounded text-xs text-blue-300 font-mono border border-slate-700 transition-all duration-300 hover:bg-slate-700 hover:border-blue-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
