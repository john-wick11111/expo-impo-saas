"use client";

import { useState } from "react";
import {
    Send,
    Mail,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    Paperclip,
    AlignLeft,
    Bold,
    Italic,
    List
} from "lucide-react";

const recentCampaigns = [
    { id: 1, subject: "Introducing our new Agro Chemicals Line", sentTo: 45, opened: 32, replied: 12, status: "completed", date: "2023-10-12" },
    { id: 2, subject: "Exclusive Fertilizer Prices for UAE Market", sentTo: 120, opened: 85, replied: 4, status: "completed", date: "2023-10-10" },
    { id: 3, subject: "Partnership Opportunity - Medical Supplies", sentTo: 15, opened: 0, replied: 0, status: "scheduled", date: "2023-11-01" },
];

export default function EmailOutreachPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [targetIndustry, setTargetIndustry] = useState("all");
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        // Mock sending process
        setTimeout(() => {
            setIsSending(false);
            setSuccess(true);
            setSubject("");
            setMessage("");
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Email Outreach</h1>
                <p className="text-zinc-600 mt-1">Compose and send bulk email campaigns to your saved buyer leads.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Composer Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600" />
                            Compose Campaign
                        </h2>

                        {success ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-200">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                <div>
                                    <h4 className="font-semibold">Campaign Sent Successfully!</h4>
                                    <p className="text-sm">Your emails are being dispatched to the selected leads.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">To: Recipient Group</label>
                                    <select
                                        value={targetIndustry}
                                        onChange={(e) => setTargetIndustry(e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl"
                                    >
                                        <option value="all">All Saved Leads (142 buyers)</option>
                                        <option value="agriculture">Agriculture Industry (84 buyers)</option>
                                        <option value="pharmaceutical">Pharmaceutical Sector (32 buyers)</option>
                                        <option value="textiles">Textiles & Apparel (26 buyers)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Export Partnership Opportunity"
                                        className="block w-full px-3 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div className="border border-zinc-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                    <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-2 flex items-center gap-2">
                                        <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><Bold className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><Italic className="w-4 h-4" /></button>
                                        <div className="w-px h-4 bg-zinc-300 mx-1"></div>
                                        <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><AlignLeft className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><List className="w-4 h-4" /></button>
                                        <div className="w-px h-4 bg-zinc-300 mx-1"></div>
                                        <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><Paperclip className="w-4 h-4" /></button>
                                    </div>
                                    <textarea
                                        required
                                        rows={8}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your email here... Use {Company Name} to personalize."
                                        className="block w-full px-3 py-3 border-0 focus:ring-0 sm:text-sm resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Load Template
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSending ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Campaign
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sidebar Data */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Audience Stats
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                                <span className="text-sm text-zinc-600">Total Reachable</span>
                                <span className="font-semibold text-zinc-900">142</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                                <span className="text-sm text-zinc-600">Avg. Open Rate</span>
                                <span className="font-semibold text-green-600">42%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-600">Avg. Reply Rate</span>
                                <span className="font-semibold text-blue-600">8%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-zinc-500" />
                            Recent Campaigns
                        </h2>
                        <div className="space-y-4">
                            {recentCampaigns.map((campaign) => (
                                <div key={campaign.id} className="block group">
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-zinc-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {campaign.subject}
                                        </p>
                                        {campaign.status === "completed" ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5 ml-2" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5 ml-2" />
                                        )}
                                    </div>
                                    <div className="mt-2 flex text-xs text-zinc-500 gap-3">
                                        <span>Sent: {campaign.sentTo}</span>
                                        <span>Opened: {campaign.opened}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
