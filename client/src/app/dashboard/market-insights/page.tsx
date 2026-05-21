"use client";

import { useState } from "react";
import Link from "next/link";
import {
    TrendingUp, Globe2, Sparkles, BarChart3, Package, Users,
    ArrowUpRight, ChevronRight, Star, Zap
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

// ── Static AI-curated data ────────────────────────────────────────────────────

const DEMAND_TREND = [
    { month: "Jan", shipments: 12400 },
    { month: "Feb", shipments: 17800 },
    { month: "Mar", shipments: 21300 },
    { month: "Apr", shipments: 27100 },
    { month: "May", shipments: 24600 },
    { month: "Jun", shipments: 31200 },
    { month: "Jul", shipments: 28900 },
    { month: "Aug", shipments: 35400 },
];

const PRODUCT_DEMAND = [
    { name: "Fertilizers",  value: 34, fill: "#3b82f6" }, // blue-500
    { name: "Chemicals",    value: 22, fill: "#a855f7" }, // purple-500
    { name: "Textiles",     value: 18, fill: "#06b6d4" }, // cyan-500
    { name: "Machinery",    value: 15, fill: "#10b981" }, // emerald-500
    { name: "Food & Agro",  value: 11, fill: "#f59e0b" }, // amber-500
];

const COUNTRY_BUBBLES = [
    { country: "UAE",          volume: 420, growth: 18, buyers: 62,  score: "High",   x: 70,  y: 30 },
    { country: "Saudi Arabia", volume: 310, growth: 14, buyers: 48,  score: "High",   x: 55,  y: 55 },
    { country: "Germany",      volume: 280, growth: 10, buyers: 41,  score: "High",   x: 35,  y: 25 },
    { country: "UK",           volume: 210, growth: 8,  buyers: 33,  score: "Medium", x: 25,  y: 45 },
    { country: "Netherlands",  volume: 190, growth: 12, buyers: 28,  score: "Medium", x: 48,  y: 72 },
    { country: "India",        volume: 380, growth: 21, buyers: 74,  score: "High",   x: 80,  y: 65 },
    { country: "France",       volume: 160, growth: 7,  buyers: 22,  score: "Medium", x: 18,  y: 68 },
];

const OPPORTUNITY_TABLE = [
    { country: "UAE",           product: "Fertilizers",    volume: "$420M", growth: "+18%", buyers: 62, score: "High" },
    { country: "India",         product: "Agro Chemicals", volume: "$380M", growth: "+21%", buyers: 74, score: "High" },
    { country: "Saudi Arabia",  product: "Food Products",  volume: "$310M", growth: "+14%", buyers: 48, score: "High" },
    { country: "Germany",       product: "Machinery",      volume: "$280M", growth: "+10%", buyers: 41, score: "High" },
    { country: "Netherlands",   product: "Textiles",       volume: "$190M", growth: "+12%", buyers: 28, score: "Medium" },
    { country: "UK",            product: "Chemicals",      volume: "$210M", growth: "+8%",  buyers: 33, score: "Medium" },
    { country: "France",        product: "Electronics",    volume: "$160M", growth: "+7%",  buyers: 22, score: "Medium" },
];

const AI_INSIGHTS = [
    {
        id: 1,
        country: "UAE",
        product: "Fertilizers",
        text: "Fertilizer imports in the UAE increased by 18% this year. Over 62 new distributors have entered the market, making UAE one of the most promising export markets for agri-inputs.",
        badge: "🌱 Agriculture",
        growth: "+18%",
    },
    {
        id: 2,
        country: "India",
        product: "Agro Chemicals",
        text: "India's agro chemical sector is booming with +21% import growth. 74 verified buyers identified. Government subsidies are driving massive demand from tier-2 cities.",
        badge: "⚗️ Chemicals",
        growth: "+21%",
    },
    {
        id: 3,
        country: "Germany",
        product: "Machinery",
        text: "German manufacturing hubs are actively importing precision machinery. Demand up 10% with 41 active buyers. Quality certifications are the key entry requirement.",
        badge: "⚙️ Machinery",
        growth: "+10%",
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreStyle(score: string) {
    if (score === "High")   return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
    if (score === "Medium") return "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function MarketInsightsPage() {
    const [activeInsight, setActiveInsight] = useState(0);

    return (
        // Override the light dashboard background with a deep, dark glassmorphic wrapper
        <div className="relative min-h-[calc(100vh-2rem)] bg-[#09090b] rounded-[2rem] p-6 sm:p-8 overflow-hidden shadow-2xl ring-1 ring-white/10">
            {/* Animated Ambient Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            {/* Content Wrapper */}
            <div className="relative z-10 space-y-8 pb-12">

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI-Powered Intelligence
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                            Live Market Data
                        </h1>
                        <p className="text-zinc-400 mt-2 max-w-xl font-medium">
                            Analyze global trade trends and discover high-demand export markets using real-time AI visualizers.
                        </p>
                    </div>
                    <Link href="/dashboard/leads">
                        <button className="group relative inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-lg text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                            <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                            Find Buyers Now
                        </button>
                    </Link>
                </div>

                {/* ── 4 Top Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Top Growing Market",
                            value: "UAE Fertilizer",
                            sub: "+18% YoY Growth",
                            icon: <Globe2 className="w-5 h-5 text-blue-400" />,
                            badge: "Live",
                            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                            glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
                        },
                        {
                            label: "New Buyers Discovered",
                            value: "42 companies",
                            sub: "Added this month",
                            icon: <Users className="w-5 h-5 text-emerald-400" />,
                            badge: "New",
                            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                            glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
                        },
                        {
                            label: "Trending Product",
                            value: "Organic Fertilizers",
                            sub: "+24% Demand surge",
                            icon: <Package className="w-5 h-5 text-purple-400" />,
                            badge: "Hot",
                            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                            glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
                        },
                        {
                            label: "Export Opportunities",
                            value: "Top 5 Markets",
                            sub: "Identified by AI analysis",
                            icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
                            badge: "AI Match",
                            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                            glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 ${card.glow} hover:bg-white/10 transition-all duration-300 p-5`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                                    {card.icon}
                                </div>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor} shadow-inner`}>
                                    {card.badge}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{card.label}</p>
                            <p className="text-xl font-extrabold text-white leading-snug tracking-tight">{card.value}</p>
                            <p className="text-xs text-zinc-400 mt-1.5 font-medium">{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Bar chart – Global Demand Trend */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    Global Demand Trend
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1">Monthly import shipments across all products</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                ↑ +24% vs last year
                            </span>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={DEMAND_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                                <Tooltip
                                    formatter={(value: any) => [`${(Number(value)/1000).toFixed(1)}k shipments`, "Volume"]}
                                    contentStyle={{ backgroundColor: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(12px)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                    itemStyle={{ color: "#60a5fa", fontWeight: "bold" }}
                                />
                                <Bar dataKey="shipments" radius={[6, 6, 0, 0]} maxBarSize={40} fill="url(#barGradient)" filter="url(#glow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Donut chart – Product Demand */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                            <Package className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                            Product Mix
                        </h2>
                        <p className="text-xs text-zinc-400 mb-6">Share of total import volume</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <defs>
                                    <filter id="pieGlow">
                                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <Pie
                                    data={PRODUCT_DEMAND}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                    filter="url(#pieGlow)"
                                >
                                    {PRODUCT_DEMAND.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(v: any) => [`${v}%`, "Share"]} 
                                    contentStyle={{ backgroundColor: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(12px)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                                    itemStyle={{ fontWeight: "bold" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2.5 mt-4 px-2">
                            {PRODUCT_DEMAND.map((p, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: p.fill, color: p.fill }} />
                                        <span className="text-zinc-300 font-medium">{p.name}</span>
                                    </div>
                                    <span className="font-bold text-white">{p.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Country Bubble Map + AI Insights ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Country Growth Visual */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Globe2 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                    Live Geo-Data Matrix
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1">Bubble size = import volume · Color = opportunity score</p>
                            </div>
                        </div>

                        {/* Bubble visual using CSS Glassmorphism */}
                        <div className="relative bg-[#050505]/50 rounded-xl border border-white/5 h-64 overflow-hidden backdrop-blur-sm shadow-inner">
                            {/* Grid overlay for tech look */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                            
                            {COUNTRY_BUBBLES.map((c) => {
                                const size = Math.round(35 + (c.volume / 420) * 45);
                                const color =
                                    c.score === "High"   ? "bg-blue-500/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]"   :
                                    c.score === "Medium" ? "bg-amber-500/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]"  : "bg-slate-500/40 border-slate-400";
                                return (
                                    <div
                                        key={c.country}
                                        className="absolute flex flex-col items-center justify-center cursor-default group"
                                        style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }}
                                    >
                                        <div
                                            className={`${color} border backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-opacity-60 z-10`}
                                            style={{ width: size, height: size }}
                                        >
                                            <span className="text-white text-[11px] font-extrabold leading-tight text-center px-1 drop-shadow-md">{c.country}</span>
                                        </div>
                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-[calc(100%+8px)] hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                                            <div className="bg-black/80 backdrop-blur-xl border border-white/20 text-white text-[11px] rounded-xl px-3 py-2 whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                                                <p className="font-extrabold text-blue-300 text-xs mb-0.5">{c.country}</p>
                                                <p className="text-zinc-300">Volume: <span className="font-bold text-white">${c.volume}M</span></p>
                                                <p className="text-zinc-300">Growth: <span className="font-bold text-emerald-400">+{c.growth}%</span></p>
                                                <p className="text-zinc-400 mt-1 border-t border-white/10 pt-1">{c.buyers} buyers found</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-5 mt-4 text-xs text-zinc-400 font-medium">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] inline-block" /> High Opportunity</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] inline-block" /> Medium</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-500/50 border border-slate-400 inline-block" /> Emerging</span>
                        </div>
                    </div>

                    {/* AI Insight Panel */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 flex flex-col relative overflow-hidden">
                        {/* decorative flare */}
                        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-purple-500/30 blur-[40px] rounded-full" />
                        
                        <div className="flex items-center gap-2 mb-5 relative z-10">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-white drop-shadow-md">AI Insights</h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1.5 mb-5 relative z-10 bg-black/20 p-1 rounded-xl">
                            {AI_INSIGHTS.map((ins, i) => (
                                <button
                                    key={ins.id}
                                    onClick={() => setActiveInsight(i)}
                                    className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${
                                        activeInsight === i
                                            ? "bg-blue-600/80 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/50"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    {ins.country}
                                </button>
                            ))}
                        </div>

                        {/* Active Insight */}
                        {(() => {
                            const ins = AI_INSIGHTS[activeInsight];
                            return (
                                <div className="flex-1 flex flex-col gap-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                            {ins.badge}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                            Growth {ins.growth}
                                        </span>
                                    </div>
                                    <div className="bg-black/30 rounded-xl border border-white/5 p-4 flex-1 shadow-inner">
                                        <p className="text-sm text-zinc-300 leading-relaxed font-medium">{ins.text}</p>
                                    </div>
                                    <Link href={`/dashboard/leads?q=${encodeURIComponent(ins.product + " " + ins.country)}`}>
                                        <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:scale-[1.02]">
                                            View Target Buyers
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* ── Export Opportunity Table ── */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/10 bg-black/20 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                Ranked Opportunities
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1">Best markets ranked by AI opportunity score</p>
                        </div>
                        <span className="text-xs font-bold text-zinc-300 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full shadow-sm">
                            {OPPORTUNITY_TABLE.length} markets found
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-black/10">
                                    {["Country", "Product", "Import Volume", "Growth Rate", "Buyers Found", "Score", "Action"].map(h => (
                                        <th key={h} className="px-5 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {OPPORTUNITY_TABLE.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                    {i + 1}
                                                </span>
                                                <span className="font-bold text-white text-sm drop-shadow-md">{row.country}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-zinc-300 whitespace-nowrap">{row.product}</td>
                                        <td className="px-5 py-4 text-sm font-bold text-white whitespace-nowrap">{row.volume}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{row.growth}</span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                                                <Users className="w-4 h-4 text-zinc-400" />
                                                {row.buyers}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${scoreStyle(row.score)}`}>
                                                {row.score === "High" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_5px_currentColor]" />}
                                                {row.score === "Medium" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-[0_0_5px_currentColor]" />}
                                                {row.score}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <Link href={`/dashboard/leads?q=${encodeURIComponent(row.product + " " + row.country)}`}>
                                                <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors opacity-50 group-hover:opacity-100 hover:scale-105">
                                                    Find Buyers <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
