"use client";

import {
    Users,
    TrendingUp,
    MailOpen,
    FileCheck,
    Search,
    FileText
} from "lucide-react";

const stats = [
    { name: 'Total Leads Saved', stat: '142', icon: Users, change: '12%', changeType: 'increase' },
    { name: 'Active Negotiations', stat: '18', icon: TrendingUp, change: '4%', changeType: 'increase' },
    { name: 'Email Open Rate', stat: '42%', icon: MailOpen, change: '2%', changeType: 'decrease' },
    { name: 'Docs Generated', stat: '34', icon: FileCheck, change: '11%', changeType: 'increase' },
];

import LeadSearchBar from "@/components/LeadSearchBar";

export default function DashboardPage() {
    return (
        <div>
            <LeadSearchBar />

            <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden rounded-2xl bg-white px-4 pt-5 pb-12 shadow-sm border border-zinc-100 sm:px-6 sm:pt-6"
                    >
                        <dt>
                            <div className="absolute rounded-xl bg-blue-50 p-3">
                                <item.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-zinc-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-3xl font-semibold text-zinc-900">{item.stat}</p>
                            <p
                                className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {item.changeType === 'increase' ? '+' : '-'}{item.change}
                            </p>
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Activity placeholder inside Dashboard */}
                <div className="rounded-2xl bg-white shadow-sm border border-zinc-100 p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Recent Lead Searches</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                            <div>
                                <p className="font-medium text-zinc-900">Agriculture / Fertilizer</p>
                                <p className="text-sm text-zinc-500">United Arab Emirates</p>
                            </div>
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                124 results
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                            <div>
                                <p className="font-medium text-zinc-900">Pharmaceuticals / Bulk Drugs</p>
                                <p className="text-sm text-zinc-500">Saudi Arabia</p>
                            </div>
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                89 results
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow-sm border border-zinc-100 p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button suppressHydrationWarning onClick={() => window.location.href = '/dashboard/leads'} className="px-4 py-4 rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-colors group">
                            <Search className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 mb-2" />
                            <p className="font-medium text-zinc-900 text-sm">Find Buyers</p>
                        </button>
                        <button suppressHydrationWarning onClick={() => window.location.href = '/dashboard/documents'} className="px-4 py-4 rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-colors group">
                            <FileText className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 mb-2" />
                            <p className="font-medium text-zinc-900 text-sm">Create Invoice</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
