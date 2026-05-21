"use client";

import { useState, useEffect } from "react";
import {
    Send, Mail, Users, CheckCircle2, Clock, AlertCircle,
    Paperclip, AlignLeft, Bold, Italic, List as ListIcon,
    Plus, Edit2, Trash2, Zap
} from "lucide-react";

// ── Shared types ──────────────────────────────────────────────────────────────

interface EmailSequenceStep {
    id?: string;
    subject: string;
    body: string;
    delayDays: number;
    stepOrder?: number;
}

interface EmailSequence {
    id: string;
    name: string;
    createdAt: string;
    steps: EmailSequenceStep[];
    metrics?: { sent: number; opened: number; replied: number };
}

// ── Static data for One-Time Emails tab ───────────────────────────────────────

const recentCampaigns = [
    { id: 1, subject: "Introducing our new Agro Chemicals Line", sentTo: 45, opened: 32, replied: 12, status: "completed", date: "2023-10-12" },
    { id: 2, subject: "Exclusive Fertilizer Prices for UAE Market", sentTo: 120, opened: 85, replied: 4, status: "completed", date: "2023-10-10" },
    { id: 3, subject: "Partnership Opportunity - Medical Supplies", sentTo: 15, opened: 0, replied: 0, status: "scheduled", date: "2023-11-01" },
];

// ── Tab 1: One-Time Emails ────────────────────────────────────────────────────

function OneTimeEmailsTab() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [targetIndustry, setTargetIndustry] = useState("all");
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setSuccess(true);
            setSubject("");
            setMessage("");
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Composer */}
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
                                    <option value="textiles">Textiles &amp; Apparel (26 buyers)</option>
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
                                    <div className="w-px h-4 bg-zinc-300 mx-1" />
                                    <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><AlignLeft className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><ListIcon className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-zinc-300 mx-1" />
                                    <button type="button" className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors"><Paperclip className="w-4 h-4" /></button>
                                </div>
                                <textarea
                                    required
                                    rows={8}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your email here... Use {Company Name} to personalize."
                                    className="block w-full px-3 py-3 border-0 focus:ring-0 sm:text-sm resize-none"
                                />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Load Template
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSending ? "Sending..." : <><Send className="w-4 h-4" /> Send Campaign</>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Sidebar stats */}
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
                            <div key={campaign.id} className="group">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium text-zinc-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {campaign.subject}
                                    </p>
                                    {campaign.status === "completed"
                                        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5 ml-2" />
                                        : <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5 ml-2" />}
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
    );
}

// ── Tab 2: Automated Sequences ────────────────────────────────────────────────

function AutomatedSequencesTab() {
    const [sequences, setSequences] = useState<EmailSequence[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null);
    const [name, setName] = useState("");
    const [steps, setSteps] = useState<EmailSequenceStep[]>([{ subject: "", body: "", delayDays: 0 }]);

    useEffect(() => { fetchSequences(); }, []);

    const fetchSequences = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/email-sequences");
            const data = await res.json();
            setSequences(data);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (sequence?: EmailSequence) => {
        if (sequence) {
            setEditingSequence(sequence);
            setName(sequence.name);
            setSteps(sequence.steps.map(s => ({ ...s })));
        } else {
            setEditingSequence(null);
            setName("");
            setSteps([{ subject: "", body: "", delayDays: 0 }]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => { setIsModalOpen(false); setEditingSequence(null); };

    const handleAddStep = () => setSteps([...steps, { subject: "", body: "", delayDays: 1 }]);

    const handleRemoveStep = (idx: number) => {
        const s = [...steps]; s.splice(idx, 1); setSteps(s);
    };

    const handleStepChange = (idx: number, field: keyof EmailSequenceStep, value: any) => {
        const s = [...steps]; s[idx] = { ...s[idx], [field]: value }; setSteps(s);
    };

    const handleSaveSequence = async () => {
        if (!name.trim() || steps.some(s => !s.subject.trim() || !s.body.trim())) {
            alert("Please fill in sequence name and all step subjects/bodies.");
            return;
        }
        try {
            const method = editingSequence ? "PUT" : "POST";
            const url = editingSequence
                ? `http://localhost:5000/api/email-sequences/${editingSequence.id}`
                : "http://localhost:5000/api/email-sequences";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, steps }) });
            if (res.ok) { fetchSequences(); handleCloseModal(); }
            else alert("Failed to save sequence");
        } catch { alert("Error saving sequence"); }
    };

    const handleDeleteSequence = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sequence?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/email-sequences/${id}`, { method: "DELETE" });
            if (res.ok) fetchSequences();
        } catch { /* silent */ }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-500">Create automated multi-step email sequences to follow up with buyers.</p>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Create Sequence
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-zinc-500">Loading sequences...</p>
                </div>
            ) : sequences.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
                    <Zap className="mx-auto h-10 w-10 text-zinc-300 mb-3" />
                    <h3 className="text-sm font-semibold text-zinc-900">No sequences yet</h3>
                    <p className="mt-1 text-sm text-zinc-500">Click "Create Sequence" to build your first automated campaign.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                            <tr>
                                {["Sequence Name", "Steps", "Created", "Metrics", "Actions"].map(h => (
                                    <th key={h} scope="col" className={`px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white">
                            {sequences.map((seq) => (
                                <tr key={seq.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900">{seq.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {seq.steps?.length || 0} Steps
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                        {new Date(seq.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                        <div className="flex flex-col gap-0.5 text-xs">
                                            <span>Sent: <span className="font-semibold text-blue-600">{seq.metrics?.sent || 0}</span></span>
                                            <span>Opened: <span className="font-semibold text-zinc-900">{seq.metrics?.opened || 0}</span></span>
                                            <span>Replied: <span className="font-semibold text-green-600">{seq.metrics?.replied || 0}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => handleOpenModal(seq)} className="text-blue-600 hover:text-blue-900">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteSequence(seq.id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-xl">
                        <div className="p-6 border-b border-zinc-200 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                {editingSequence ? "Edit Sequence" : "Create Sequence"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 text-2xl leading-none">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Sequence Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                    placeholder="e.g. Follow-up Campaign 1"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-zinc-900">Email Steps</h3>
                                    <button type="button" onClick={handleAddStep} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Add Step
                                    </button>
                                </div>

                                {steps.map((step, index) => (
                                    <div key={index} className="pl-4 pr-6 py-4 bg-zinc-50 border border-zinc-200 rounded-xl relative space-y-4">
                                        {steps.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveStep(index)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-zinc-200 text-zinc-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                            <h4 className="font-medium text-zinc-900 text-sm">Step {index + 1}</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-medium text-zinc-500 mb-1">Subject Line</label>
                                                <input
                                                    type="text"
                                                    value={step.subject}
                                                    onChange={(e) => handleStepChange(index, "subject", e.target.value)}
                                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                                                    placeholder="Enter email subject"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-medium text-zinc-500 mb-1">Email Body</label>
                                                <textarea
                                                    value={step.body}
                                                    onChange={(e) => handleStepChange(index, "body", e.target.value)}
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                                                    placeholder={"Hi [Name],\n\n..."}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-zinc-500 mb-1">Delay (Days)</label>
                                                <div className="relative">
                                                    <Clock className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                                                    <input
                                                        type="number" min={0}
                                                        value={step.delayDays}
                                                        onChange={(e) => handleStepChange(index, "delayDays", parseInt(e.target.value) || 0)}
                                                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-zinc-500">Days to wait before sending</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-zinc-200 bg-zinc-50 shrink-0 flex justify-end gap-3">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50">Cancel</button>
                            <button onClick={handleSaveSequence} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Sequence</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Page Shell ────────────────────────────────────────────────────────────────

const TABS = [
    { id: "one-time",   label: "One-Time Emails",      icon: <Mail className="w-4 h-4" /> },
    { id: "sequences",  label: "Automated Sequences",  icon: <Zap  className="w-4 h-4" /> },
] as const;

type TabId = typeof TABS[number]["id"];

export default function EmailCampaignsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("one-time");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Email Campaigns</h1>
                <p className="text-zinc-500 mt-1">Send one-time outreach emails or build automated follow-up sequences.</p>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                            activeTab === tab.id
                                ? "bg-white shadow-sm text-blue-700"
                                : "text-zinc-500 hover:text-zinc-800"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "one-time"  && <OneTimeEmailsTab />}
            {activeTab === "sequences" && <AutomatedSequencesTab />}
        </div>
    );
}
