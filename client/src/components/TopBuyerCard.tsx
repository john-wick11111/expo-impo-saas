"use client";

import Link from "next/link";
import { MapPin, Briefcase, Package, TrendingUp, Star, UserPlus, Loader2 } from "lucide-react";

interface Buyer {
    id: string;
    companyName: string;
    country: string;
    industry: string;
    productCategory: string;
    website: string;
    email: string;
    verificationScore: number;
}

interface TopBuyerCardProps {
    buyer: Buyer;
    onSave: (id: string) => void;
    isSaving: boolean;
    isSaved: boolean;
}

// Map a score 0–10 → simulated import value
function estimateImportValue(score: number): string {
    const base = score * 250000;
    const value = base + Math.floor(score * 80000);
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    return `$${Math.round(value / 1000)}K`;
}

// Map a score 0–10 → simulated demand growth
function estimateGrowth(score: number): number {
    return Math.round(score * 2.5 + 3);
}

export default function TopBuyerCard({ buyer, onSave, isSaving, isSaved }: TopBuyerCardProps) {
    const importValue = estimateImportValue(buyer.verificationScore || 5);
    const growth = estimateGrowth(buyer.verificationScore || 5);
    const scoreColor =
        (buyer.verificationScore || 0) >= 8 ? "bg-green-50 text-green-700 border-green-200" :
        (buyer.verificationScore || 0) >= 5 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
        "bg-red-50 text-red-700 border-red-200";

    // Parse top products from productCategory (comma separated often)
    const topProducts = buyer.productCategory
        ? buyer.productCategory.split(/[,;/]+/).slice(0, 3).map(p => p.trim()).filter(Boolean)
        : [];

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col p-5 gap-3 group">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <Link href={`/dashboard/buyers/${buyer.id}`}>
                        <h3 className="font-semibold text-zinc-900 text-[15px] leading-snug group-hover:text-blue-600 transition-colors truncate">
                            {buyer.companyName}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 flex-wrap">
                        <MapPin className="w-3 h-3 shrink-0 text-zinc-400" />
                        <span>{buyer.country || "Unknown"}</span>
                        <span className="text-zinc-300">•</span>
                        <Briefcase className="w-3 h-3 shrink-0 text-zinc-400" />
                        <span className="truncate">{buyer.industry || "General"}</span>
                    </div>
                </div>
                {/* Lead Score badge */}
                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${scoreColor}`}>
                    <Star className="w-3 h-3" />
                    {buyer.verificationScore || 0}/10
                </span>
            </div>

            {/* Trade Stats */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-0.5">
                        <Package className="w-3 h-3" /> Est. Imports
                    </div>
                    <p className="text-sm font-bold text-zinc-800">{importValue}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 mb-0.5">
                        <TrendingUp className="w-3 h-3" /> Demand Growth
                    </div>
                    <p className="text-sm font-bold text-emerald-700">+{growth}%</p>
                </div>
            </div>

            {/* Top Products */}
            {topProducts.length > 0 && (
                <div>
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Top Products</p>
                    <div className="flex flex-wrap gap-1.5">
                        {topProducts.map((product, i) => (
                            <span key={i} className="inline-block bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full border border-blue-100">
                                {product}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto pt-1">
                <Link href={`/dashboard/buyers/${buyer.id}`} className="flex-1">
                    <button className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                        View Buyer
                    </button>
                </Link>
                {isSaved ? (
                    <span className="flex-1 inline-flex items-center justify-center text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        ✓ Saved
                    </span>
                ) : (
                    <button
                        onClick={() => onSave(buyer.id)}
                        disabled={isSaving}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                        Save Lead
                    </button>
                )}
            </div>
        </div>
    );
}
