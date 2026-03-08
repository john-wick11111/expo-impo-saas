"use client";

import { useState } from "react";
import { Search, Loader2, BarChart3, TrendingUp, Globe2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MarketInsight {
    country: string;
    importerCount: number;
    marketScore: 'High' | 'Medium' | 'Low';
}

export default function MarketInsightsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [insights, setInsights] = useState<MarketInsight[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError("");
        setHasSearched(true);

        try {
            const res = await fetch(`http://localhost:5000/api/market-insights?productCategory=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setInsights(data);
            } else {
                setError("Failed to fetch market insights. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Connection error. Please ensure the server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreStyles = (score: string) => {
        switch (score) {
            case 'High':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low':
                return 'bg-zinc-100 text-zinc-700 border-zinc-200';
            default:
                return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                    <Globe2 className="w-6 h-6 text-blue-600" />
                    Market Insights
                </h1>
                <p className="text-zinc-600 mt-1">Discover the top importing countries for specific product categories to target your outreach.</p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 mb-8">
                <form onSubmit={handleSearch} className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Enter a product to analyze import markets (e.g. fertilizer, spices, electronics)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !searchQuery.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart3 className="w-5 h-5" />}
                        Analyze Market
                    </button>
                </form>
            </div>

            {/* Results Section */}
            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl mb-8 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {!isLoading && hasSearched && !error && insights.length === 0 && (
                <div className="text-center p-12 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                    <BarChart3 className="w-12 h-12 text-zinc-300 mx-auto border-2 border-zinc-100 rounded-xl p-2 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Market Data Found</h3>
                    <p className="text-zinc-500">We couldn't find any importers for "{searchQuery}". Try a broader category.</p>
                </div>
            )}

            {!isLoading && insights.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Insights Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Top Importing Countries
                            </h2>
                            <span className="text-sm font-medium text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200">
                                {insights.length} markets found
                            </span>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Country</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Importers</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Market Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {insights.map((insight, idx) => (
                                        <tr key={insight.country} className="hover:bg-zinc-50/80 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex justify-center items-center text-xs font-bold font-mono">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="font-medium text-zinc-900">{insight.country}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-600 font-medium">
                                                {insight.importerCount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getScoreStyles(insight.marketScore)}`}>
                                                    {insight.marketScore}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chart Visualization */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 flex flex-col">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Market Demand Distribution
                        </h2>
                        <div className="flex-1 min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={insights.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4e4e7" />
                                    <XAxis type="number" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <YAxis dataKey="country" type="category" tick={{ fill: '#3f3f46', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f4f4f5' }}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="importerCount" radius={[0, 4, 4, 0]} maxBarSize={40}>
                                        {insights.slice(0, 10).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : index < 3 ? '#3b82f6' : '#93c5fd'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-zinc-400 mt-4">Showing top {Math.min(insights.length, 10)} markets by volume</p>
                    </div>
                </div>
            )}
        </div>
    );
}
