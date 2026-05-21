"use client";

import { useState } from "react";
import Link from "next/link";
import {
    TrendingUp, Globe2, Sparkles, BarChart3, Package, Users,
    ArrowUpRight, ChevronRight, Star, Zap
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend,
    PieChart, Pie
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
    { name: "Fertilizers",  value: 34, fill: "#2563eb" },
    { name: "Chemicals",    value: 22, fill: "#7c3aed" },
    { name: "Textiles",     value: 18, fill: "#0891b2" },
    { name: "Machinery",    value: 15, fill: "#059669" },
    { name: "Food & Agro",  value: 11, fill: "#d97706" },
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
    if (score === "High")   return "bg-green-50 text-green-700 border-green-200";
    if (score === "Medium") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-zinc-100 text-zinc-600 border-zinc-200";
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function MarketInsightsPage() {
    const [activeInsight, setActiveInsight] = useState(0);

    return (
        <div className="space-y-8 pb-12">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI-Powered Intelligence
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">AI Market Insights</h1>
                    <p className="text-zinc-500 mt-1 max-w-xl">
                        Analyze global trade trends and discover high-demand export markets using AI insights.
                    </p>
                </div>
                <Link href="/dashboard/leads">
                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                        <Zap className="w-4 h-4" />
                        Find Buyers Now
                    </button>
                </Link>
            </div>

            {/* ── 4 Top Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    {
                        label: "Top Growing Export Market",
                        value: "UAE Fertilizer Imports",
                        sub: "Growth: +18% year over year",
                        icon: <Globe2 className="w-5 h-5 text-blue-600" />,
                        badge: "+18%",
                        badgeColor: "bg-blue-50 text-blue-700",
                        border: "border-t-blue-500",
                    },
                    {
                        label: "New Buyers Discovered",
                        value: "42 companies",
                        sub: "Added this month",
                        icon: <Users className="w-5 h-5 text-emerald-600" />,
                        badge: "↑ This Month",
                        badgeColor: "bg-emerald-50 text-emerald-700",
                        border: "border-t-emerald-500",
                    },
                    {
                        label: "Trending Product",
                        value: "Organic Fertilizers",
                        sub: "Demand growth: +24%",
                        icon: <Package className="w-5 h-5 text-violet-600" />,
                        badge: "+24%",
                        badgeColor: "bg-violet-50 text-violet-700",
                        border: "border-t-violet-500",
                    },
                    {
                        label: "Export Opportunities",
                        value: "Top 5 Markets",
                        sub: "Identified by AI analysis",
                        icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
                        badge: "AI Identified",
                        badgeColor: "bg-amber-50 text-amber-700",
                        border: "border-t-amber-500",
                    },
                ].map((card, i) => (
                    <div
                        key={i}
                        className={`bg-white rounded-2xl border border-zinc-200 border-t-4 ${card.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                {card.icon}
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                                {card.badge}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">{card.label}</p>
                        <p className="text-lg font-bold text-zinc-900 leading-snug">{card.value}</p>
                        <p className="text-xs text-zinc-500 mt-1">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bar chart – Global Demand Trend */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                Global Demand Trend
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">Monthly import shipments across all products</p>
                        </div>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                            ↑ +24% vs last year
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={DEMAND_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                            <Tooltip
                                formatter={(value: number) => [`${(value/1000).toFixed(1)}k shipments`, "Volume"]}
                                contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7", fontSize: 12 }}
                                cursor={{ fill: "#f4f4f5" }}
                            />
                            <Bar dataKey="shipments" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                {DEMAND_TREND.map((_, idx) => (
                                    <Cell key={idx} fill={idx === DEMAND_TREND.length - 1 ? "#2563eb" : "#bfdbfe"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Donut chart – Product Demand */}
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                    <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-violet-600" />
                        Product Demand Mix
                    </h2>
                    <p className="text-xs text-zinc-400 mb-4">Share of total import volume by category</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={PRODUCT_DEMAND}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={78}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {PRODUCT_DEMAND.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7", fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {PRODUCT_DEMAND.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
                                    <span className="text-zinc-600">{p.name}</span>
                                </div>
                                <span className="font-semibold text-zinc-800">{p.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Country Bubble Map + AI Insights ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Country Growth Visual */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                                <Globe2 className="w-4 h-4 text-blue-600" />
                                Country Growth Map
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">Bubble size = import volume · Color = opportunity score</p>
                        </div>
                    </div>

                    {/* Bubble visual using CSS */}
                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 h-56 overflow-hidden">
                        {COUNTRY_BUBBLES.map((c) => {
                            const size = Math.round(28 + (c.volume / 420) * 42);
                            const color =
                                c.score === "High"   ? "bg-blue-500"   :
                                c.score === "Medium" ? "bg-amber-400"  : "bg-zinc-400";
                            return (
                                <div
                                    key={c.country}
                                    className="absolute flex flex-col items-center justify-center cursor-default group"
                                    style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }}
                                >
                                    <div
                                        className={`${color} rounded-full opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-md`}
                                        style={{ width: size, height: size }}
                                    >
                                        <span className="text-white text-[10px] font-bold leading-tight text-center px-1">{c.country}</span>
                                    </div>
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                                        <div className="bg-zinc-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                                            <p className="font-semibold">{c.country}</p>
                                            <p>Volume: ${c.volume}M · Growth: +{c.growth}%</p>
                                            <p>{c.buyers} buyers found</p>
                                        </div>
                                        <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> High Opportunity</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Medium</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-zinc-400 inline-block" /> Emerging</span>
                        <span className="ml-auto">Hover over bubble for details</span>
                    </div>
                </div>

                {/* AI Insight Panel */}
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h2 className="text-base font-bold text-zinc-900">AI Insights</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-4">
                        {AI_INSIGHTS.map((ins, i) => (
                            <button
                                key={ins.id}
                                onClick={() => setActiveInsight(i)}
                                className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-colors ${
                                    activeInsight === i
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
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
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                                        {ins.badge}
                                    </span>
                                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                        Growth {ins.growth}
                                    </span>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 flex-1">
                                    <p className="text-sm text-zinc-700 leading-relaxed">{ins.text}</p>
                                </div>
                                <Link href={`/dashboard/leads?q=${encodeURIComponent(ins.product + " " + ins.country)}`}>
                                    <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                        View Buyers
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ── Export Opportunity Table ── */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            Export Opportunity Table
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Best markets ranked by AI opportunity score</p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 bg-white border border-zinc-200 px-3 py-1.5 rounded-full">
                        {OPPORTUNITY_TABLE.length} markets
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100">
                                {["Country", "Product", "Import Volume", "Growth Rate", "Buyers Found", "Opportunity Score", "Action"].map(h => (
                                    <th key={h} className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {OPPORTUNITY_TABLE.map((row, i) => (
                                <tr key={i} className="hover:bg-zinc-50/60 transition-colors group">
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                                                {i + 1}
                                            </span>
                                            <span className="font-semibold text-zinc-900 text-sm">{row.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-zinc-600 whitespace-nowrap">{row.product}</td>
                                    <td className="px-5 py-3.5 text-sm font-semibold text-zinc-900 whitespace-nowrap">{row.volume}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="text-sm font-bold text-green-700">{row.growth}</span>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 text-sm text-zinc-600">
                                            <Users className="w-3.5 h-3.5 text-zinc-400" />
                                            {row.buyers} buyers
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${scoreStyle(row.score)}`}>
                                            {row.score === "High" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />}
                                            {row.score === "Medium" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />}
                                            {row.score}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <Link href={`/dashboard/leads?q=${encodeURIComponent(row.product + " " + row.country)}`}>
                                            <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors opacity-0 group-hover:opacity-100">
                                                Find Buyers <ChevronRight className="w-3.5 h-3.5" />
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
    );
}
