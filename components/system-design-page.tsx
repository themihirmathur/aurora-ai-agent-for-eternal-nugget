"use client"

import { useState } from "react"
import DashboardCharts from "./dashboard-charts"
import ArchitectureSection from "./architecture-section"
import FunnelArchitecture from "./funnel-architecture"
import DataSchemaSection from "./data-schema-section"
import SequenceSimulator from "./sequence-simulator"

export default function SystemDesignPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Proactive Order Rescuer</h1>
              <p className="text-xs text-slate-500">System Design & Architecture</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">
              Dashboard
            </a>
            <a
              href="#architecture"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              Architecture
            </a>
            <a href="#funnel" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">
              Funnel
            </a>
            <a href="#data-logic" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">
              Data & State
            </a>
            <a href="#sequence" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">
              Sequence
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Dashboard Section */}
        <section id="dashboard" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">System Overview & Requirements</h2>
              <p className="text-slate-600 max-w-3xl">
                The Proactive Order Rescuer is an autonomous agentic system for Quick Commerce environments. It
                mitigates SLA breaches by intercepting "at-risk" orders via a{" "}
                <span className="font-semibold">Plan-Act-Reflect</span> loop. Below are the key non-functional
                requirements and operational metrics.
              </p>
            </div>
            <DashboardCharts />
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">High-Level Architecture (HLD)</h2>
              <p className="text-slate-600">
                Explore the core components of the system. Click on any block in the diagram below to view its specific
                Role, Technology Stack, and Logic.
              </p>
            </div>
            <ArchitectureSection />
          </div>
        </section>

        <section id="funnel" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Processing Pipeline: Funnel Architecture</h2>
              <p className="text-slate-600">
                Visualize how orders flow through the system stages. Watch as 95% of safe orders are filtered at the
                Risk Engine stage, while only the suspicious 5% proceed to the LLM-powered Brain for deep analysis.
              </p>
            </div>
            <FunnelArchitecture />
          </div>
        </section>

        {/* Data & Logic Section */}
        <section id="data-logic" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Low-Level Design (LLD): Data & Schemas</h2>
              <p className="text-slate-600">
                Detailed view of the Agent's internal memory state, database persistence layer, and API contracts.
              </p>
            </div>
            <DataSchemaSection />
          </div>
        </section>

        {/* Sequence Simulator Section */}
        <section id="sequence" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SequenceSimulator />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>Proactive Order Rescuer System Design Documentation</p>
          <p className="text-slate-500 text-xs mt-1">Built with Next.js, React, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
