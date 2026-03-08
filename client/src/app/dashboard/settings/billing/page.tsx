"use client";

import { CreditCard, Calendar, Activity, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
    // In a real app, this would be fetched from /api/user/billing-details
    const mockUser = {
        plan: "Growth",
        nextBilling: "July 12, 2026",
        cardLast4: "4242",
        usage: {
            searches: { used: 120, limit: 1000 },
            leads: { used: 80, limit: 1000 },
            emails: { used: 45, limit: 500 }
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">Billing & Subscription</h1>
                <p className="text-zinc-600">Manage your subscription plan, payment methods, and monitor your monthly usage limits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Current Plan Overview */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-1">Current Plan</h3>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold text-zinc-900">{mockUser.plan}</h2>
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">Active</span>
                                </div>
                            </div>
                            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-right">
                                <p className="text-sm text-zinc-500 mb-1">Next Payment</p>
                                <p className="font-medium text-zinc-900">{mockUser.nextBilling}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-100 mb-8">
                            <CreditCard className="w-5 h-5 text-zinc-400" />
                            <span>Visa ending in <strong className="text-zinc-900">{mockUser.cardLast4}</strong></span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/dashboard/pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors text-sm text-center">
                            Upgrade Plan
                        </Link>
                        <button className="px-4 py-2 bg-white border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700 text-zinc-700 rounded-xl font-medium shadow-sm transition-colors text-sm">
                            Cancel Subscription
                        </button>
                    </div>
                </div>

                {/* Quick Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
                        <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-700 opacity-50 route-spin-slow" />
                        <h3 className="font-semibold mb-2 relative z-10">Need more power?</h3>
                        <p className="text-indigo-200 text-sm mb-4 relative z-10">Upgrade to the Professional plan for unlimited access to everything.</p>
                        <Link href="/dashboard/pricing" className="inline-block text-sm font-medium text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg relative z-10 shadow-sm">
                            View Professional
                        </Link>
                    </div>
                </div>
            </div>

            {/* Usage Metrics */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-zinc-900">Monthly Usage</h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Searches Metric */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-zinc-700">Buyer Searches</span>
                            <span className="text-zinc-900">{mockUser.usage.searches.used} / {mockUser.usage.searches.limit}</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(mockUser.usage.searches.used / mockUser.usage.searches.limit) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Leads Metric */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-zinc-700">Leads Saved</span>
                            <span className="text-zinc-900">{mockUser.usage.leads.used} / {mockUser.usage.leads.limit}</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(mockUser.usage.leads.used / mockUser.usage.leads.limit) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Emails Metric */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-zinc-700">Outreach Emails</span>
                            <span className="text-zinc-900">{mockUser.usage.emails.used} / {mockUser.usage.emails.limit}</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(mockUser.usage.emails.used / mockUser.usage.emails.limit) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
