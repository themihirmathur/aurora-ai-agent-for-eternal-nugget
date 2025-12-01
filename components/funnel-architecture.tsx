"use client"

import { useState, useEffect, useRef } from "react"
import { Database, BrainCircuit, Filter, Zap, Save } from "lucide-react"

const FunnelArchitecture = () => {
  const [selectedStage, setSelectedStage] = useState(null)
  const [stats, setStats] = useState({ total: 0, filtered: 0, processed: 0 })

  // Geometry Constants
  const SVG_WIDTH = 1000
  const SVG_HEIGHT = 600
  const FLOW_Y = 250

  // Zones
  const ZONES = {
    FIREHOSE: { x: 50, y: 100, w: 250, h: 300, color: "#ef4444", label: "The Firehose", sub: "Kafka" },
    FILTER: { x: 300, w: 300, hStart: 300, hEnd: 80, color: "#06b6d4", label: "The Filter", sub: "Risk Engine" },
    BRAIN: { x: 600, y: 210, w: 250, h: 80, color: "#8b5cf6", label: "The Brain", sub: "LangGraph Agent" },
    MEMORY: { x: 200, y: 450, w: 500, h: 100, color: "#475569", label: "The Memory", sub: "Redis + Postgres" },
  }

  // --- Particle System Logic ---
  const [particles, setParticles] = useState([])
  const requestRef = useRef()

  useEffect(() => {
    let lastTime = performance.now()
    const SPAWN_RATE = 50
    let timeSinceSpawn = 0

    const updateParticles = (time) => {
      const deltaTime = time - lastTime
      lastTime = time
      timeSinceSpawn += deltaTime

      // 1. Spawn new particles
      if (timeSinceSpawn > SPAWN_RATE) {
        const newParticles = Array.from({ length: 3 }).map(() => ({
          id: Math.random(),
          x: ZONES.FIREHOSE.x + 20,
          y: FLOW_Y + (Math.random() - 0.5) * 200,
          speed: 4 + Math.random() * 2,
          status: "active",
          type: "order",
        }))

        setParticles((prev) => [...prev, ...newParticles])
        setStats((s) => ({ ...s, total: s.total + 3 }))
        timeSinceSpawn = 0
      }

      // 2. Move & Update Particles
      setParticles((prev) =>
        prev
          .map((p) => {
            let { x, y, speed, status } = p

            if (status === "processing") {
              x += speed * 0.2
            } else {
              x += speed
            }

            // Entering Filter
            if (x > ZONES.FILTER.x && x < ZONES.FILTER.x + 20 && status === "active") {
              const progress = (x - ZONES.FILTER.x) / ZONES.FILTER.w
              const targetY = FLOW_Y + (y - FLOW_Y) * (1 - progress * 0.8)
              y = targetY
            }

            // Decision Point: End of Filter
            if (x > ZONES.BRAIN.x && status === "active") {
              if (Math.random() > 0.05) {
                status = "filtered"
                setStats((s) => ({ ...s, filtered: s.filtered + 1 }))
              } else {
                status = "processing"
                y = FLOW_Y + (Math.random() - 0.5) * 40
              }
            }

            // End of Brain
            if (x > ZONES.BRAIN.x + ZONES.BRAIN.w && status === "processing") {
              status = "done"
              setStats((s) => ({ ...s, processed: s.processed + 1 }))
            }

            return { ...p, x, y, status }
          })
          .filter((p) => {
            if (p.status === "filtered") return p.y < 500 && p.x < ZONES.BRAIN.x + 50
            if (p.status === "done") return false
            return p.x < SVG_WIDTH
          }),
      )

      requestRef.current = requestAnimationFrame(updateParticles)
    }

    requestRef.current = requestAnimationFrame(updateParticles)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  const getFilterPath = () => {
    const { x, w, hStart, hEnd } = ZONES.FILTER
    const yTopStart = FLOW_Y - hStart / 2
    const yBotStart = FLOW_Y + hStart / 2
    const yTopEnd = FLOW_Y - hEnd / 2
    const yBotEnd = FLOW_Y + hEnd / 2

    return `M ${x} ${yTopStart} L ${x + w} ${yTopEnd} L ${x + w} ${yBotEnd} L ${x} ${yBotStart} Z`
  }

  const getConnectorPath = (startX, startY, endX, endY) => {
    return `M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8 flex justify-between items-end border-b border-slate-300 pb-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent">
            Funnel Architecture
          </h3>
          <p className="text-slate-600 text-sm mt-1">High-Volume Event Processing Pipeline</p>
        </div>
        <div className="flex gap-6 text-sm font-mono">
          <div className="text-red-600">
            <span className="block text-xs text-slate-500">INGESTED</span>
            {stats.total.toLocaleString()}
          </div>
          <div className="text-cyan-600">
            <span className="block text-xs text-slate-500">FILTERED (95%)</span>
            {stats.filtered.toLocaleString()}
          </div>
          <div className="text-violet-600">
            <span className="block text-xs text-slate-500">ANALYZED (5%)</span>
            {stats.processed.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="relative w-full max-w-6xl aspect-[5/3] bg-white rounded-xl border border-slate-300 shadow-lg overflow-hidden">
        {/* Detail Overlay */}
        {selectedStage && (
          <div className="absolute top-4 right-4 z-20 w-72 bg-white border border-slate-300 rounded-lg p-4 shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg" style={{ color: selectedStage.color }}>
                {selectedStage.label}
              </h3>
              <button onClick={() => setSelectedStage(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">{selectedStage.sub}</p>
              <p>{selectedStage.desc}</p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-600 mb-1">KEY METRICS</h4>
                <ul className="space-y-1 text-xs">
                  {selectedStage.metrics.map((m, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{m.k}</span>
                      <span className="font-mono text-slate-900">{m.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* The Diagram */}
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full select-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
            </marker>
            <linearGradient id="firehoseGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="filterGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Connectors */}
          <path
            d={getConnectorPath(ZONES.FILTER.x + ZONES.FILTER.w / 2, FLOW_Y + 70, ZONES.MEMORY.x + 150, ZONES.MEMORY.y)}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />
          <path
            d={getConnectorPath(ZONES.BRAIN.x + ZONES.BRAIN.w / 2, FLOW_Y + 50, ZONES.MEMORY.x + 350, ZONES.MEMORY.y)}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />

          {/* Firehose */}
          <g
            onClick={() =>
              setSelectedStage({
                ...ZONES.FIREHOSE,
                desc: "Ingests millions of raw order events per second. Acts as a buffer to decouple producers from consumers.",
                metrics: [
                  { k: "Throughput", v: "100k/sec" },
                  { k: "Retention", v: "7 Days" },
                ],
              })
            }
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <rect
              x={ZONES.FIREHOSE.x}
              y={FLOW_Y - ZONES.FIREHOSE.h / 2}
              width={ZONES.FIREHOSE.w}
              height={ZONES.FIREHOSE.h}
              fill="url(#firehoseGrad)"
              stroke={ZONES.FIREHOSE.color}
              strokeWidth="2"
              rx="8"
            />
            <foreignObject
              x={ZONES.FIREHOSE.x}
              y={FLOW_Y - ZONES.FIREHOSE.h / 2}
              width={ZONES.FIREHOSE.w}
              height={ZONES.FIREHOSE.h}
              className="pointer-events-none"
            >
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Database className="w-12 h-12 text-red-300 mb-2" />
                <h2 className="text-xl font-bold text-slate-900">The Firehose</h2>
                <span className="text-xs bg-red-100 px-2 py-1 rounded text-red-700 mt-1 font-mono">Kafka Cluster</span>
                <p className="text-xs text-red-600/70 mt-4 italic">Unfiltered Stream</p>
              </div>
            </foreignObject>
          </g>

          {/* Filter */}
          <g
            onClick={() =>
              setSelectedStage({
                ...ZONES.FILTER,
                desc: "A lightweight, deterministic rule engine. It discards 95% of 'Safe' orders instantly to save compute costs.",
                metrics: [
                  { k: "Latency", v: "<5ms" },
                  { k: "Pass Rate", v: "5%" },
                ],
              })
            }
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <path d={getFilterPath()} fill="url(#filterGrad)" stroke={ZONES.FILTER.color} strokeWidth="2" />
            <foreignObject
              x={ZONES.FILTER.x}
              y={FLOW_Y - 50}
              width={ZONES.FILTER.w}
              height={100}
              className="pointer-events-none"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <Filter className="w-8 h-8 text-cyan-500 mb-1" />
                <h2 className="text-lg font-bold text-slate-900">The Filter</h2>
                <span className="text-xs bg-cyan-100 px-2 py-1 rounded text-cyan-700 font-mono">Risk Engine</span>
              </div>
            </foreignObject>
            <text
              x={ZONES.FILTER.x + ZONES.FILTER.w / 2}
              y={FLOW_Y + 140}
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="12"
              fontStyle="italic"
            >
              Discard 95% Safe
            </text>
            <path
              d={`M ${ZONES.FILTER.x + ZONES.FILTER.w / 2} ${FLOW_Y + 60} L ${ZONES.FILTER.x + ZONES.FILTER.w / 2} ${FLOW_Y + 120}`}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.5"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* Brain */}
          <g
            onClick={() =>
              setSelectedStage({
                ...ZONES.BRAIN,
                desc: "A complex AI agent using LangGraph. It performs deep analysis on the suspicious 5% using LLMs.",
                metrics: [
                  { k: "Latency", v: "~800ms" },
                  { k: "Cost", v: "$$$ High" },
                ],
              })
            }
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <rect
              x={ZONES.BRAIN.x}
              y={ZONES.BRAIN.y}
              width={ZONES.BRAIN.w}
              height={ZONES.BRAIN.h}
              fill="#8b5cf6"
              fillOpacity="0.15"
              stroke={ZONES.BRAIN.color}
              strokeWidth="2"
              rx="8"
            />
            <foreignObject
              x={ZONES.BRAIN.x}
              y={ZONES.BRAIN.y}
              width={ZONES.BRAIN.w}
              height={ZONES.BRAIN.h}
              className="pointer-events-none"
            >
              <div className="h-full flex flex-row items-center justify-center gap-4">
                <BrainCircuit className="w-10 h-10 text-violet-500" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-slate-900">The Brain</h2>
                  <span className="text-xs bg-violet-100 px-2 py-1 rounded text-violet-700 font-mono">LangGraph</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Memory */}
          <g
            onClick={() =>
              setSelectedStage({
                ...ZONES.MEMORY,
                desc: "Shared state layer. Redis handles short-term context (deduplication windows), Postgres stores immutable logs.",
                metrics: [
                  { k: "Ops/Sec", v: "50k" },
                  { k: "Storage", v: "Persistent" },
                ],
              })
            }
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <rect
              x={ZONES.MEMORY.x}
              y={ZONES.MEMORY.y}
              width={ZONES.MEMORY.w}
              height={ZONES.MEMORY.h}
              fill="#f1f5f9"
              stroke={ZONES.MEMORY.color}
              strokeWidth="2"
              rx="8"
            />
            <path
              d={`M ${ZONES.MEMORY.x} ${ZONES.MEMORY.y + 10} Q ${ZONES.MEMORY.x + ZONES.MEMORY.w / 2} ${ZONES.MEMORY.y - 15} ${ZONES.MEMORY.x + ZONES.MEMORY.w} ${ZONES.MEMORY.y + 10}`}
              fill="none"
              stroke="#cbd5e1"
              opacity="0.5"
            />

            <foreignObject
              x={ZONES.MEMORY.x}
              y={ZONES.MEMORY.y}
              width={ZONES.MEMORY.w}
              height={ZONES.MEMORY.h}
              className="pointer-events-none"
            >
              <div className="h-full flex flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <span className="block font-bold text-slate-900">Redis</span>
                    <span className="text-xs text-slate-600">Hot Context</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <span className="block font-bold text-slate-900">Postgres</span>
                    <span className="text-xs text-slate-600">Long-term Logs</span>
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Particles */}
          {particles.map((p) => {
            let fill = "#fca5a5"
            let opacity = 0.8

            if (p.x >= ZONES.FILTER.x && p.status === "active") fill = "#7dd3fc"
            if (p.status === "filtered") {
              fill = "#cbd5e1"
              opacity = 0.4
            } else if (p.status === "processing") fill = "#c4b5fd"

            const yPos = p.status === "filtered" ? p.y + (p.x - ZONES.FILTER.x) * 0.5 : p.y

            return (
              <circle
                key={p.id}
                cx={p.x}
                cy={yPos}
                r={p.status === "processing" ? 4 : 2}
                fill={fill}
                opacity={opacity}
                style={{ transition: "r 0.2s" }}
              />
            )
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-600 bg-white/80 px-3 py-2 rounded border border-slate-300">
          <p>Click on components for details</p>
        </div>
      </div>

      {/* Footer Text */}
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-sm">
        <div className="bg-white p-4 rounded border border-slate-200">
          <h3 className="text-red-600 font-bold mb-2">1. The Firehose</h3>
          <p>
            Raw order events arrive at massive velocity. No logic is applied here; it's purely about capturing the
            stream reliably using Kafka partitions.
          </p>
        </div>
        <div className="bg-white p-4 rounded border border-slate-200">
          <h3 className="text-cyan-600 font-bold mb-2">2. The Filter</h3>
          <p>
            A deterministic "Risk Engine". It uses simple thresholds (velocity check, IP blacklist) to instantly approve
            95% of orders. Low latency, low cost.
          </p>
        </div>
        <div className="bg-white p-4 rounded border border-slate-200">
          <h3 className="text-violet-600 font-bold mb-2">3. The Brain</h3>
          <p>
            Only the "grey area" orders reach here. A LangGraph agent pulls context from Redis/Postgres and reasons
            about the risk. High latency, high intelligence.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FunnelArchitecture
