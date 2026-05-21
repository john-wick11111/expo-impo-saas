"use client";

import { useState } from "react";
import {
    Check, X, Loader2, Sparkles, CreditCard, Calendar,
    Shield, ArrowUpRight, AlertTriangle, Layers, Activity, Zap
} from "lucide-react";

// ── Plan data ─────────────────────────────────────────────────────────────────

const PLANS = [
    {
        id: "starter",
        name: "Starter",
        price: 19,
        priceId: "price_starter_mock_id",
        description: "Perfect for individuals starting their export journey.",
        dark: false,
        popular: false,
        cta: "Select Starter",
        features: [
            { text: "100 buyer searches / mo",       included: true },
            { text: "200 saved leads",                included: true },
            { text: "50 emails / mo",                 included: true },
            { text: "Advanced analytics",             included: false },
            { text: "CRM integrations",               included: false },
            { text: "Priority support",               included: false },
        ],
    },
    {
        id: "growth",
        name: "Growth",
        price: 49,
        priceId: "price_growth_mock_id",
        description: "For growing teams that need a consistent flow of B2B leads.",
        dark: true,
        popular: true,
        cta: "Select Growth",
        features: [
            { text: "1,000 buyer searches / mo",     included: true },
            { text: "1,000 saved leads",              included: true },
            { text: "500 emails / mo",                included: true },
            { text: "Advanced analytics",             included: true },
            { text: "CRM integrations",               included: true },
            { text: "Priority support",               included: false },
        ],
    },
    {
        id: "professional",
        name: "Professional",
        price: 99,
        priceId: "price_professional_mock_id",
        description: "Maximum power for high-volume enterprise exporters.",
        dark: false,
        popular: false,
        cta: "Select Professional",
        features: [
            { text: "Unlimited buyer searches",       included: true },
            { text: "Unlimited saved leads",          included: true },
            { text: "Unlimited emails",               included: true },
            { text: "Advanced analytics",             included: true },
            { text: "CRM integrations",               included: true },
            { text: "Priority 24/7 support",          included: true },
        ],
    },
];

const CURRENT_PLAN = {
    name: "Growth",
    price: 49,
    nextBillingDate: "April 15, 2026",
    paymentMethod: "Visa ending in 4242",
    status: "Active",
};

// Simulated usage — in production from /api/user/billing
const USAGE = {
    searches: { used: 120, limit: 1000, color: "bg-blue-500" },
    leads:    { used: 80,  limit: 1000, color: "bg-emerald-500" },
    emails:   { used: 45, limit: 500,  color: "bg-indigo-500" },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [cancelConfirm, setCancelConfirm] = useState(false);

    const handleSelectPlan = async (priceId: string, planId: string) => {
        try {
            setIsLoading(planId);
            const response = await fetch("http://localhost:5000/api/stripe/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });
            if (!response.ok) throw new Error("Failed to create checkout session");
            const data = await response.json();
            if (data.url) window.location.href = data.url;
        } catch {
            alert("Payment system is currently unavailable. Please try again later.");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-8 pb-16">

            {/* ── Page Header ── */}
            <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 mb-3">
                    <Layers className="w-3.5 h-3.5" />
                    Subscription & Billing
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Subscription</h1>
                <p className="text-zinc-500 mt-1">Manage your plan, billing details, and upgrade when you're ready to scale.</p>
            </div>

            {/* ── Section 1: Current Plan ── */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                    <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        Current Plan
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        {CURRENT_PLAN.status}
                    </span>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Plan</p>
                        <p className="text-lg font-bold text-zinc-900">{CURRENT_PLAN.name}</p>
                        <p className="text-sm text-zinc-500">${CURRENT_PLAN.price}/month</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Next Billing Date</p>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            <p className="text-sm font-semibold text-zinc-800">{CURRENT_PLAN.nextBillingDate}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Payment Method</p>
                        <div className="flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-zinc-400" />
                            <p className="text-sm font-semibold text-zinc-800">{CURRENT_PLAN.paymentMethod}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end justify-center">
                        <button
                            onClick={() => handleSelectPlan("price_growth_mock_id", "upgrade")}
                            disabled={isLoading !== null}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            Upgrade Plan
                        </button>
                        {!cancelConfirm ? (
                            <button
                                onClick={() => setCancelConfirm(true)}
                                className="text-xs text-zinc-400 hover:text-red-600 transition-colors"
                            >
                                Cancel Subscription
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                <span className="text-xs text-red-700 font-medium">Are you sure?</span>
                                <button onClick={() => setCancelConfirm(false)} className="text-xs text-red-600 font-bold hover:underline">Yes</button>
                                <span className="text-red-300">|</span>
                                <button onClick={() => setCancelConfirm(false)} className="text-xs text-zinc-500 hover:underline">No</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Section 2: Billing — Monthly Usage ── */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                    <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Monthly Usage
                    </h2>
                    <span className="text-xs text-zinc-400">Resets on {CURRENT_PLAN.nextBillingDate}</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {([
                        { label: "Buyer Searches",  key: "searches" },
                        { label: "Leads Saved",     key: "leads" },
                        { label: "Outreach Emails", key: "emails" },
                    ] as const).map(({ label, key }) => {
                        const u = USAGE[key];
                        const pct = Math.min(100, Math.round((u.used / u.limit) * 100));
                        return (
                            <div key={key} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-zinc-600">{label}</span>
                                    <span className="text-zinc-900">{u.used} / {u.limit}</span>
                                </div>
                                <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`${u.color} h-2.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-zinc-400">{pct}% used</p>
                            </div>
                        );
                    })}
                </div>

                {/* Promo strip */}
                <div className="mx-6 mb-6 bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-5 flex items-center justify-between gap-4 relative overflow-hidden">
                    <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-700 opacity-40" />
                    <div className="relative z-10">
                        <p className="font-semibold text-white text-sm mb-1">Need more power?</p>
                        <p className="text-indigo-300 text-xs">Upgrade to Professional for unlimited access to everything.</p>
                    </div>
                    <button
                        onClick={() => handleSelectPlan("price_professional_mock_id", "professional")}
                        className="relative z-10 shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-900 bg-indigo-50 hover:bg-white px-4 py-2 rounded-xl shadow-sm transition-colors"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        View Professional
                    </button>
                </div>
            </div>

            {/* ── Section 3: Available Plans ── */}
            <div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-zinc-900">Available Plans</h2>
                    <p className="text-sm text-zinc-500 mt-1">Upgrade or downgrade anytime. Changes take effect immediately.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-3xl p-8 border relative flex flex-col h-full transition-shadow ${
                                plan.dark
                                    ? "bg-zinc-900 border-zinc-800 shadow-xl md:-translate-y-3"
                                    : "bg-white border-zinc-200 shadow-sm hover:shadow-md"
                            } ${plan.name === CURRENT_PLAN.name ? "ring-2 ring-blue-500" : ""}`}
                        >
                            {/* Current plan badge */}
                            {plan.name === CURRENT_PLAN.name && (
                                <div className="absolute top-0 right-6 -translate-y-1/2">
                                    <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow">
                                        Current Plan
                                    </span>
                                </div>
                            )}

                            {/* Most popular badge */}
                            {plan.popular && plan.name !== CURRENT_PLAN.name && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-teal-950 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-3 h-3" /> Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan info */}
                            <div className="mb-6">
                                <h3 className={`text-xl font-bold mb-2 ${plan.dark ? "text-white" : "text-zinc-900"}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className={`text-4xl font-extrabold ${plan.dark ? "text-white" : "text-zinc-900"}`}>${plan.price}</span>
                                    <span className={`font-medium ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>/month</span>
                                </div>
                                <p className={`text-sm ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>{plan.description}</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((f, i) => (
                                    <li key={i} className={`flex items-start gap-3 ${
                                        f.included
                                            ? plan.dark ? "text-zinc-300" : "text-zinc-700"
                                            : plan.dark ? "text-zinc-600" : "text-zinc-400"
                                    }`}>
                                        {f.included
                                            ? <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.dark ? "text-emerald-400" : "text-emerald-500"}`} />
                                            : <X className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                                        <span className="text-sm">{f.text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            {plan.name === CURRENT_PLAN.name ? (
                                <div className={`w-full py-3 px-4 rounded-xl text-center text-sm font-semibold ${plan.dark ? "bg-zinc-700 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>
                                    Your Current Plan
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSelectPlan(plan.priceId, plan.id)}
                                    disabled={isLoading !== null}
                                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                                        plan.dark
                                            ? "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20"
                                            : "bg-white border-2 border-zinc-200 hover:border-blue-400 hover:text-blue-700 text-zinc-900"
                                    }`}
                                >
                                    {isLoading === plan.id
                                        ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                        : plan.cta}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Footer note ── */}
            <p className="text-center text-xs text-zinc-400">
                All plans include a 7-day free trial. Cancel anytime — no lock-in contracts.
            </p>

        </div>
    );
}
