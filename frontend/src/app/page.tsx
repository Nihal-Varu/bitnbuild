"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Users, Network, Code2, Globe, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-6 pt-32 pb-20 relative z-10 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live Event Ingestion Active
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Unify Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Customer Journey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12"
        >
          A powerful identity resolution platform that stitches disjointed cross-channel events into a single, unified timeline to track drop-offs, escalations, and churn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-950 hover:bg-slate-200 transition-colors rounded-lg font-semibold shadow-lg shadow-white/5">
            Open Dashboard
            <ArrowRight size={18} />
          </Link>
          <Link href="/event-simulator" className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors rounded-lg font-medium text-slate-300">
            <Activity size={18} />
            Try Simulator
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32 text-left"
        >
          <FeatureCard 
            icon={<Network className="text-blue-400" size={24} />}
            title="Identity Stitching"
            description="Automatically link anonymous browser cookies, device IDs, and loyalty numbers to a single verified customer profile."
          />
          <FeatureCard 
            icon={<Globe className="text-purple-400" size={24} />}
            title="Cross-Channel Analytics"
            description="Visualize the full path from marketing website to mobile app, support calls, and physical store visits."
          />
          <FeatureCard 
            icon={<Shield className="text-emerald-400" size={24} />}
            title="Churn Prediction"
            description="Identify drop-offs and unresolved support escalations before they result in permanent customer churn."
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 backdrop-blur-xl p-6 rounded-2xl hover:bg-slate-800/50 transition-colors duration-300">
      <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
