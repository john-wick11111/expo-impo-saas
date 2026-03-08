"use client";

import { useState } from "react";
import {
    Building,
    MapPin,
    Briefcase,
    MoreVertical,
    Phone,
    Mail,
    CheckCircle2,
    MessageCircle,
    FileEdit,
    DollarSign,
    GitMerge
} from "lucide-react";
import ExportDropdown from "@/components/ExportDropdown";
import StartSequenceModal from "@/components/StartSequenceModal";

type LeadStatus = "New Lead" | "Contacted" | "Negotiation" | "Deal Closed";

interface Lead {
    id: string;
    companyName: string;
    country: string;
    industry: string;
    status: LeadStatus;
    contactName: string;
    email: string;
    dealValue: number;
}

const initialLeads: Lead[] = [
    { id: "1", companyName: "AgriTech Global LLC", country: "UAE", industry: "Agriculture", status: "New Lead", contactName: "Ahmed Ali", email: "procurement@agritech.ae", dealValue: 15000 },
    { id: "2", companyName: "Desert Greens Trading", country: "UAE", industry: "Agriculture", status: "Contacted", contactName: "Sara Khan", email: "imports@desertgreens.com", dealValue: 24000 },
    { id: "3", companyName: "Oasis Supply Co", country: "Saudi Arabia", industry: "Agriculture", status: "Negotiation", contactName: "Omar Saeed", email: "buy@oasissupply.sa", dealValue: 85000 },
    { id: "4", companyName: "Saudi Pharma Import", country: "Saudi Arabia", industry: "Pharmaceutical", status: "Deal Closed", contactName: "Dr. Youssef", email: "hello@saudipharma.com", dealValue: 120000 },
    { id: "5", companyName: "Gulf Medicare Solutions", country: "Qatar", industry: "Pharmaceutical", status: "New Lead", contactName: "Nasser Al-Thani", email: "contact@gulfmedicare.qa", dealValue: 0 },
];

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
    { id: "New Lead", title: "New Lead", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "Contacted", title: "Contacted", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { id: "Negotiation", title: "Negotiation", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { id: "Deal Closed", title: "Deal Closed", color: "bg-green-100 text-green-700 border-green-200" },
];

export default function CRMPage() {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [selectedBuyerForSequence, setSelectedBuyerForSequence] = useState<string | null>(null);

    const moveLead = (id: string, newStatus: LeadStatus) => {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">CRM Pipeline</h1>
                    <p className="text-zinc-600 mt-1">Manage your active buyer negotiations and deals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportDropdown source="crm" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                        <span>+ Add Lead</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max h-full">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="w-80 flex flex-col bg-zinc-100/50 rounded-2xl border border-zinc-200/60 p-3">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${col.color}`}>
                                        {col.title}
                                    </span>
                                </h3>
                                <span className="text-zinc-400 text-sm font-medium">
                                    {leads.filter(l => l.status === col.id).length}
                                </span>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto">
                                {leads.filter(l => l.status === col.id).map((lead) => (
                                    <div key={lead.id} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-zinc-900 line-clamp-1">{lead.companyName}</h4>
                                            <div className="relative inline-block text-left">
                                                <button className="text-zinc-400 hover:text-zinc-600 focus:outline-none">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 mb-4">
                                            <div className="flex items-center text-xs text-zinc-500">
                                                <MapPin className="w-3 h-3 mr-1.5" /> {lead.country}
                                            </div>
                                            <div className="flex items-center text-xs text-zinc-500">
                                                <Briefcase className="w-3 h-3 mr-1.5" /> {lead.industry}
                                            </div>
                                            {lead.dealValue > 0 && (
                                                <div className="flex items-center text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-1 rounded-md w-max border border-emerald-100">
                                                    <DollarSign className="w-3 h-3 mr-0.5" /> {lead.dealValue.toLocaleString()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                                            <div className="flex -space-x-2">
                                                <button className="w-8 h-8 rounded-full bg-blue-50 border border-white flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors" title="Email Lead">
                                                    <Mail className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-blue-50 border border-white flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors" title="Add Note">
                                                    <FileEdit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedBuyerForSequence(lead.id)}
                                                    className="w-8 h-8 rounded-full bg-blue-50 border border-white flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="Start Sequence"
                                                >
                                                    <GitMerge className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <select
                                                className="text-xs bg-zinc-50 border border-zinc-200 rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 outline-none cursor-pointer"
                                                value={lead.status}
                                                onChange={(e) => moveLead(lead.id, e.target.value as LeadStatus)}
                                            >
                                                <option value="New Lead">Move to New Lead</option>
                                                <option value="Contacted">Move to Contacted</option>
                                                <option value="Negotiation">Move to Negotiation</option>
                                                <option value="Deal Closed">Move to Deal Closed</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}

                                {leads.filter(l => l.status === col.id).length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 text-sm font-medium">
                                        No leads here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedBuyerForSequence && (
                <StartSequenceModal
                    buyerIds={[selectedBuyerForSequence]}
                    onClose={() => setSelectedBuyerForSequence(null)}
                />
            )}
        </div>
    );
}
