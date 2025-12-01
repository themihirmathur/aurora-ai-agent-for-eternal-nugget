"use client"

import { useState, useEffect } from "react"
import { Play, RotateCcw } from "lucide-react"

const sequenceSteps = [
  {
    id: 1,
    title: "Risk Engine Detects Issue",
    desc: "Detects 'rider_stuck' signal. Score: 0.85.",
    log: "[RiskEngine] ALERT: Order #9981 Risk Score 0.85 (Threshold 0.7). Emitting event.",
  },
  {
    id: 2,
    title: "Service Init",
    desc: "Agent Service inits AgentState in Redis.",
    log: "[AgentService] Received alert. Initializing State for #9981. Loading Context...",
  },
  {
    id: 3,
    title: "Agent Planning",
    desc: "Agent constructs prompt with SOPs.",
    log: "[Orchestrator] Prompt constructed. Invoking LLM with context.",
  },
  {
    id: 4,
    title: "LLM Reasoning",
    desc: "LLM decides to check status.",
    log: "[LLM] Thought: Rider is stuck. I need to find alternatives. Action: Call `check_nearby_riders`.",
  },
  {
    id: 5,
    title: "Tool Execution",
    desc: "Tool finds Rider B nearby.",
    log: "[ToolGateway] Executing `check_nearby_riders`. Result: Found Rider B (0.5km away).",
  },
  {
    id: 6,
    title: "Agent Observation",
    desc: "Agent receives tool output.",
    log: "[Orchestrator] Observation received. Re-invoking LLM.",
  },
  {
    id: 7,
    title: "LLM Decision",
    desc: "LLM decides to reassign.",
    log: "[LLM] Thought: Rider B is viable. Action: Call `reassign_rider(Rider B)`.",
  },
  {
    id: 8,
    title: "Action Execution",
    desc: "Logistics API called.",
    log: "[ToolGateway] POST /logistics/reassign. Payload: {rider_id: 'Rider_B'}. Status: 200 OK.",
  },
  {
    id: 9,
    title: "Reflection & Notify",
    desc: "Agent notifies user of update.",
    log: "[Orchestrator] Issue resolved. Notifying user via Comms Service.",
  },
  {
    id: 10,
    title: "Completion",
    desc: "Logs saved to Postgres.",
    log: "[AgentService] Execution finished. Saving audit log to DB. Status: SUCCESS.",
  },
]

export default function SequenceSimulator() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && currentStep < sequenceSteps.length - 1) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)
        setLogs((prev) => [...prev, sequenceSteps[nextStep].log])
      }, 1500)
    } else if (currentStep >= sequenceSteps.length - 1) {
      setIsPlaying(false)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep])

  const handlePlay = () => {
    setCurrentStep(-1)
    setLogs([])
    setIsPlaying(true)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
    setLogs([])
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Simulation: The "Reassign" Flow</h3>
          <p className="text-slate-600 text-sm">Visualizing the 10-step sequence from Risk Detection to Resolution.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isPlaying
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
            }`}
          >
            <Play size={16} />
            {isPlaying ? "Running..." : "Start Simulation"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Steps Timeline */}
        <div className="relative pl-8 border-l-2 border-slate-200">
          {sequenceSteps.map((step, idx) => (
            <div
              key={step.id}
              className={`mb-8 transition-all duration-300 ${currentStep >= idx ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep >= idx ? "bg-blue-600 border-blue-600 text-white" : "bg-white text-slate-600"
                }`}
              >
                {step.id}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Console Log */}
        <div className="bg-slate-900 rounded-xl p-6 shadow-2xl h-[550px] flex flex-col border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
            <span className="text-slate-400 font-mono text-sm">System Logs</span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto flex-grow font-mono text-xs">
            {logs.length === 0 && (
              <div className="text-slate-500 italic text-xs">{`> System Ready. Waiting for trigger...`}</div>
            )}
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="text-green-400 border-l-2 border-slate-700 pl-3 py-1 text-xs animate-in fade-in slide-in-from-bottom-2"
              >
                <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
