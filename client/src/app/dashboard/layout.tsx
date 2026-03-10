"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Search,
    LayoutDashboard,
    Mail,
    FileText,
    Settings,
    Menu,
    Bell,
    LogOut,
    X,
    CreditCard,
    List as ListIcon,
    BarChart3
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Lead Generator", href: "/dashboard/leads", icon: Search },
    { name: "Saved Lists", href: "/dashboard/lists", icon: ListIcon },
    { name: "CRM Pipeline", href: "/dashboard/crm", icon: Users },
    { name: "Email Outreach", href: "/dashboard/email", icon: Mail },
    { name: "Email Sequences", href: "/dashboard/email-sequences", icon: Mail },
    { name: "Market Insights", href: "/dashboard/market-insights", icon: BarChart3 },
    { name: "Export Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg leading-none">E</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Expo&Impo</span>
                    </div>
                    <button
                        type="button"
                        className="lg:hidden p-2 text-zinc-500 hover:text-zinc-700"
                        onClick={() => setSidebarOpen(false)}
                        suppressHydrationWarning
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-zinc-400"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-zinc-200">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    >
                        <Settings className="w-5 h-5 text-zinc-400" />
                        Settings
                    </Link>
                    <Link
                        href="/dashboard/settings/billing"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors pl-8 text-sm border-l-2 border-transparent hover:border-zinc-300 ml-3"
                    >
                        Billing
                    </Link>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                        suppressHydrationWarning
                    >
                        <LogOut className="w-5 h-5 text-red-500" />
                        Sign out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-zinc-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        suppressHydrationWarning
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500" suppressHydrationWarning>
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200" aria-hidden="true" />

                            <div className="flex items-center gap-x-4">
                                <span className="sr-only">Your profile</span>
                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                    JD
                                </div>
                                <span className="hidden lg:flex lg:items-center">
                                    <span className="text-sm font-medium leading-6 text-zinc-900" aria-hidden="true">
                                        John Doe
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Area */}
                <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
