"use client";

import { useState } from "react";
import { User, Building, Bell, Shield, Key, CreditCard, Save } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    
    // Form states
    const [name, setName] = useState("Shaikh Maaz");
    const [email, setEmail] = useState("maaz031712@gmail.com");
    const [company, setCompany] = useState("Emzii");

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
                <p className="text-zinc-500 mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            { id: "company", label: "Company Info", icon: Building },
                            { id: "notifications", label: "Notifications", icon: Bell },
                            { id: "security", label: "Security", icon: Shield },
                            { id: "api", label: "API Keys", icon: Key },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Personal Information</h3>
                                <p className="text-sm text-zinc-500">Update your photo and personal details here.</p>
                            </div>
                            
                            <hr className="border-zinc-100" />
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full max-w-md px-4 py-2 border border-zinc-200 rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full max-w-md px-4 py-2 border border-zinc-200 rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Company Tab */}
                    {activeTab === "company" && (
                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Company Information</h3>
                                <p className="text-sm text-zinc-500">Update your business details and billing address.</p>
                            </div>
                            
                            <hr className="border-zinc-100" />
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Company Name</label>
                                    <input 
                                        type="text" 
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full max-w-md px-4 py-2 border border-zinc-200 rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Industry</label>
                                    <select className="w-full max-w-md px-4 py-2 border border-zinc-200 rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white">
                                        <option>Import/Export</option>
                                        <option>Manufacturing</option>
                                        <option>Logistics</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab === "notifications" || activeTab === "security" || activeTab === "api") && (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">Coming Soon</h3>
                            <p className="text-zinc-500 max-w-sm">This section is currently under development. Additional settings will be available in the next update.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
