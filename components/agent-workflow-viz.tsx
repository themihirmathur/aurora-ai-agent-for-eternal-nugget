"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  AlertTriangle,
  Brain,
  MessageSquare,
  Activity,
  Truck,
  CheckCircle2,
  Play,
  RotateCcw,
  Terminal,
  Search,
  type LucideIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// --- Types ---
type NodeType = "trigger" | "agent" | "tool" | "end"

interface NodeData {
  id: string
  label: string
  type: NodeType
  icon: LucideIcon
  description: string
  details: string
  x: number
  y: number
}

interface LogEntry {
  step: number
  source: string
  message: string
  type: "info" | "action" | "success" | "error"
}

// --- Data Configuration ---
const NODES: NodeData[] = [
  {
    id: "risk_engine",
    label: "Risk Engine",
    type: "trigger",
    icon: AlertTriangle,
    description: "Monitors SLA & Signals",
    details:
      "INPUT: Order #9981\nSIGNALS: Rider_Idle_Time > 5m, Traffic_Index = High\nLOGIC: if risk_score > 0.7 -> Trigger Agent",
    x: 2,
    y: 1,
  },
  {
    id: "agent_brain",
    label: "Agent Brain (LLM)",
    type: "agent",
    icon: Brain,
    description: "Orchestrator (GPT-4o)",
    details:
      "SYSTEM PROMPT:\nYou are the Order Rescuer.\nPolicy:\n1. Check Status\n2. If delay > 10m -> Reassign\n3. Notify User",
    x: 2,
    y: 3,
  },
  {
    id: "tool_status",
    label: "Check Status",
    type: "tool",
    icon: Search,
    description: "Fetch Live Context",
    details:
      "API CALL: GET /api/orders/9981/live_status\nRESPONSE: { rider_lat: ..., traffic: 'heavy', kitchen: 'ready' }",
    x: 4,
    y: 2,
  },
  {
    id: "tool_reassign",
    label: "Reassign Rider",
    type: "tool",
    icon: Truck,
    description: "Logistics API",
    details:
      "API CALL: POST /api/logistics/reassign\nPAYLOAD: { exclude_rider_id: 'R1', radius: '1km' }\nRESULT: Assigned Rider 'R2'",
    x: 4,
    y: 3,
  },
  {
    id: "tool_notify",
    label: "Notify User",
    type: "tool",
    icon: MessageSquare,
    description: "WhatsApp/In-App",
    details: "API CALL: POST /api/comms/send\nTEMPLATE: 'delay_apology_reassign'\nCHANNEL: WhatsApp",
    x: 4,
    y: 4,
  },
  {
    id: "end_state",
    label: "Resolved",
    type: "end",
    icon: CheckCircle2,
    description: "Order Back on Track",
    details: "FINAL STATE:\nRisk Score: 0.1\nNew ETA: 12:45 PM\nCustomer Sentiment: Neutral/Positive",
    x: 2,
    y: 5,
  },
]

const SIMULATION_SEQUENCE = [
  {
    nodeId: "risk_engine",
    log: "Monitoring Order #9981... Risk Detected (0.85). Triggering Agent.",
  },
  {
    nodeId: "agent_brain",
    log: "Agent activated. Analyzing context... Deciding to Check Status.",
  },
  {
    nodeId: "tool_status",
    log: "Tool Executed: Status is 'Rider stuck, 15 min delay'.",
  },
  {
    nodeId: "agent_brain",
    log: "Observation received. Delay > 10 mins. Decision: Reassign Rider.",
  },
  {
    nodeId: "tool_reassign",
    log: "Tool Executed: Reassigned to Rider 'Rahul' (0.5km away).",
  },
  {
    nodeId: "agent_brain",
    log: "Reassignment confirmed. Decision: Notify Customer.",
  },
  {
    nodeId: "tool_notify",
    log: "Tool Executed: Sent WhatsApp: 'We've assigned a faster rider...'",
  },
  {
    nodeId: "agent_brain",
    log: "All actions complete. Evaluating risk...",
  },
  { nodeId: "end_state", log: "Risk mitigated. Workflow complete." },
]

// --- Components ---
interface NodeCardProps {
  node: NodeData
  isActive: boolean
  onClick: () => void
}

const NodeCard: React.FC<NodeCardProps> = ({ node, isActive, onClick }) => {
  const Icon = node.icon

  const colors = {
    trigger: "border-red-500/50 bg-red-950/20 text-red-400",
    agent: "border-purple-500/50 bg-purple-950/20 text-purple-400",
    tool: "border-blue-500/50 bg-blue-950/20 text-blue-400",
    end: "border-green-500/50 bg-green-950/20 text-green-400",
  }

  const activeGlow = isActive
    ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
    : "opacity-80 hover:opacity-100 hover:border-slate-400"

  return (
    <motion.div
      layoutId={node.id}
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isActive ? 1.05 : 1, opacity: 1 }}
      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${colors[node.type]} ${activeGlow} backdrop-blur-sm w-full max-w-sm`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-black/30">
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm md:text-base truncate">{node.label}</h3>
          <p className="text-xs opacity-80 truncate">{node.description}</p>
        </div>
      </div>

      {/* Connector Dots */}
      <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-slate-600 rounded-full -translate-x-1/2" />
      <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-slate-600 rounded-full -translate-x-1/2" />
    </motion.div>
  )
}

interface ToolsContainerProps {
  activeNodeId: string | null
  selectedNode: NodeData | null
  setSelectedNode: (node: NodeData) => void
}

const ToolsContainer: React.FC<ToolsContainerProps> = ({ activeNodeId, selectedNode, setSelectedNode }) => {
  const toolNodes = NODES.filter((n) => n.type === "tool")

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
      {toolNodes.map((node) => (
        <div key={node.id} className="relative group">
          {/* Connector line from brain */}
          <div className="hidden lg:block absolute -top-12 left-1/2 w-0.5 h-12 bg-slate-700 -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full bg-blue-400"
              initial={{ height: "0%" }}
              animate={{ height: activeNodeId === node.id ? "100%" : "0%" }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <NodeCard node={node} isActive={activeNodeId === node.id} onClick={() => setSelectedNode(node)} />
        </div>
      ))}
    </div>
  )
}

const ExecutionLogs: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <div className="bg-black/80 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex flex-col min-h-[300px]">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
        <Terminal size={14} className="text-green-400 flex-shrink-0" />
        <h3 className="font-mono text-xs text-slate-300">EXECUTION TRACE</h3>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>

      <div className="p-4 overflow-y-auto font-mono text-xs space-y-3 flex-1">
        {logs.length === 0 && <div className="text-slate-600 italic">Waiting for event trigger...</div>}
        {logs.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-2 border-slate-700 pl-3 py-1"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400 font-bold">[{log.source}]</span>
              <span className="text-slate-500 text-[10px]">Step {log.step + 1}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{log.message}</p>
          </motion.div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}

interface NodeInspectorProps {
  selectedNode: NodeData | null
}

const NodeInspector: React.FC<NodeInspectorProps> = ({ selectedNode }) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg h-1/3 flex flex-col">
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-300 flex items-center gap-2">
          <Search size={14} /> Node Inspector
        </h3>
        {!selectedNode && <span className="text-xs text-slate-500">Select a node</span>}
      </div>
      <div className="p-4 overflow-y-auto flex-1 font-mono text-sm">
        {selectedNode ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 text-slate-200">
              {React.createElement(selectedNode.icon, {
                size: 16,
                className: "text-purple-400 flex-shrink-0",
              })}
              <span className="font-bold">{selectedNode.label}</span>
            </div>
            <div className="h-px bg-slate-800 w-full" />
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Internal Logic / Payload</p>
              <pre className="text-xs text-blue-300 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap break-words">
                {selectedNode.details}
              </pre>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Description</p>
              <p className="text-slate-400 text-xs">{selectedNode.description}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
            Click any node in the graph to inspect its logic, prompts, or API schemas.
          </div>
        )}
      </div>
    </div>
  )
}

// --- Main Component ---
export default function AgentWorkflowViz() {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && currentStep < SIMULATION_SEQUENCE.length - 1) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)

        const stepData = SIMULATION_SEQUENCE[nextStep]
        setLogs((prev) => [
          ...prev,
          {
            step: nextStep,
            source: NODES.find((n) => n.id === stepData.nodeId)?.label || "System",
            message: stepData.log,
            type: "info",
          },
        ])
      }, 1500)
    } else if (currentStep >= SIMULATION_SEQUENCE.length - 1) {
      setIsPlaying(false)
    }

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep])

  const startSimulation = () => {
    setCurrentStep(-1)
    setLogs([])
    setIsPlaying(true)
    setSelectedNode(null)
  }

  const activeNodeId = currentStep >= 0 ? SIMULATION_SEQUENCE[currentStep].nodeId : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-900 text-purple-200">LANGGRAPH</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-900 text-blue-200">REACT FLOW</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Proactive Order Rescuer
          </h1>
          <p className="text-slate-400 text-sm mt-1">Agentic Workflow Visualization • Trigger → Plan → Act → Reflect</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={startSimulation}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              isPlaying
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/20"
            }`}
          >
            {isPlaying ? (
              <Activity className="animate-spin flex-shrink-0" size={18} />
            ) : (
              <Play size={18} className="flex-shrink-0" />
            )}
            {isPlaying ? "Running..." : "Simulate Risk Event"}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false)
              setCurrentStep(-1)
              setLogs([])
            }}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Graph */}
        <div className="lg:col-span-2 relative bg-slate-900/50 rounded-2xl border border-slate-800 p-8 min-h-[600px] shadow-xl overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="relative z-10 flex flex-col items-center gap-6 h-full justify-center">
            {/* 1. Risk Engine */}
            <div className="relative">
              <NodeCard
                node={NODES[0]}
                isActive={activeNodeId === "risk_engine"}
                onClick={() => setSelectedNode(NODES[0])}
              />
              <div className="h-8 w-0.5 bg-slate-700 mx-auto relative overflow-hidden">
                <motion.div
                  className="w-full bg-yellow-400"
                  initial={{ height: "0%" }}
                  animate={{ height: currentStep >= 0 ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* 2. Agent Brain */}
            <div className="relative w-full max-w-md flex justify-center">
              <NodeCard
                node={NODES[1]}
                isActive={activeNodeId === "agent_brain"}
                onClick={() => setSelectedNode(NODES[1])}
              />
            </div>

            {/* 3. Tools Container */}
            <ToolsContainer activeNodeId={activeNodeId} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />

            {/* 4. End State */}
            <div className="relative mt-4">
              <div className="h-8 w-0.5 bg-slate-700 mx-auto relative overflow-hidden mb-0">
                <motion.div
                  className="w-full bg-green-400"
                  initial={{ height: "0%" }}
                  animate={{
                    height: currentStep === SIMULATION_SEQUENCE.length - 1 ? "100%" : "0%",
                  }}
                />
              </div>
              <NodeCard
                node={NODES[5]}
                isActive={activeNodeId === "end_state"}
                onClick={() => setSelectedNode(NODES[5])}
              />
            </div>
          </div>

          {/* Thinking State Overlay */}
          <AnimatePresence>
            {activeNodeId === "agent_brain" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-4 bg-purple-900/80 backdrop-blur text-purple-200 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border border-purple-500/30"
              >
                <Brain size={12} className="animate-pulse flex-shrink-0" />
                ORCHESTRATING...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Inspector & Logs */}
        <div className="flex flex-col gap-6 h-full">
          <NodeInspector selectedNode={selectedNode} />
          <ExecutionLogs logs={logs} />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-slate-500 text-xs border-t border-slate-800 pt-6">
        <p>
          Built to demonstrate agentic AI workflows. Click nodes to inspect logic. Press "Simulate Risk Event" to watch
          the agent rescuer in action.
        </p>
      </footer>
    </div>
  )
}
