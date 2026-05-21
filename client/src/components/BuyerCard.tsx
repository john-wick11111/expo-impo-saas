"use client";

import Link from "next/link";
import { MapPin, Briefcase, Globe, Mail, Star, UserCircle, Save, Loader2, Package, TrendingUp } from "lucide-react";

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

interface BuyerCardProps {
    buyer: Buyer;
    onSave: (id: string) => void;
    isSaving: boolean;
    isSaved: boolean;
}

function estimateImportValue(score: number): string {
    const value = score * 280000 + score * 90000;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    return `$${Math.round(value / 1000)}K`;
}

function estimateGrowth(score: number): number {
    return Math.round(score * 2.2 + 4);
}

export default function BuyerCard({ buyer, onSave, isSaving, isSaved }: BuyerCardProps) {
    const score = buyer.verificationScore || 0;
    const scoreColor =
        score >= 8 ? "bg-green-50 text-green-700 border-green-200" :
        score >= 5 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
        "bg-red-50 text-red-700 border-red-200";

    const scoreBorderTop =
        score >= 8 ? "border-t-green-500" :
        score >= 5 ? "border-t-yellow-400" :
        "border-t-red-400";

    const topProducts = buyer.productCategory
        ? buyer.productCategory.split(/[,;/]+/).slice(0, 3).map(p => p.trim()).filter(Boolean)
        : [];

    const importValue = estimateImportValue(score);
    const growth = estimateGrowth(score);

    return (
        <div className={`bg-white rounded-2xl border border-zinc-200 border-t-4 ${scoreBorderTop} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group`}>
            {/* Card Body */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Company Name & Score */}
                <div className="flex items-start justify-between gap-2">
                    <Link href={`/dashboard/buyers/${buyer.id}`} className="min-w-0 flex-1">
                        <h3 className="font-bold text-[15px] text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                            {buyer.companyName}
                        </h3>
                    </Link>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${scoreColor}`}>
                        <Star className="w-3 h-3" />
                        {score}/10
                    </span>
                </div>

                {/* Location & Industry */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        {buyer.country || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                        {buyer.industry || "General"}
                    </span>
                </div>

                {/* Website & Email */}
                <div className="space-y-1">
                    {buyer.website ? (
                        <a
                            href={buyer.website.startsWith("http") ? buyer.website : `https://${buyer.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-green-700 hover:underline truncate"
                        >
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{buyer.website}</span>
                        </a>
                    ) : (
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Globe className="w-3.5 h-3.5" /> No Website
                        </span>
                    )}
                    {buyer.email ? (
                        <span className="flex items-center gap-1.5 text-xs text-zinc-600 truncate">
                            <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">{buyer.email}</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Mail className="w-3.5 h-3.5" /> No Email
                        </span>
                    )}
                </div>

                {/* Trade Stats */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-zinc-50 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-0.5">
                            <Package className="w-3 h-3" /> Est. Imports
                        </div>
                        <p className="text-xs font-bold text-zinc-800">{importValue}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 mb-0.5">
                            <TrendingUp className="w-3 h-3" /> Growth
                        </div>
                        <p className="text-xs font-bold text-emerald-700">+{growth}%</p>
                    </div>
                </div>

                {/* Top Products */}
                {topProducts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {topProducts.map((product, i) => (
                            <span key={i} className="inline-block bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                                {product}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-zinc-100 mt-auto">
                <Link href={`/dashboard/buyers/${buyer.id}`} className="flex-1">
                    <button className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                        <UserCircle className="w-3.5 h-3.5" />
                        View Profile
                    </button>
                </Link>
                {isSaved ? (
                    <span className="flex-1 inline-flex items-center justify-center text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        ✓ Saved
                    </span>
                ) : (
                    <button
                        onClick={() => onSave(buyer.id)}
                        disabled={isSaving}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Save Lead
                    </button>
                )}
            </div>
        </div>
    );
}
