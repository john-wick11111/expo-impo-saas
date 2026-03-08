"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Mail, Briefcase, Loader2, Search, GitMerge } from "lucide-react";
import ExportDropdown from "@/components/ExportDropdown";
import StartSequenceModal from "@/components/StartSequenceModal";

interface Buyer {
    id: string;
    companyName: string;
    country: string;
    industry: string;
    website: string | null;
    email: string | null;
}

interface ListItem {
    id: string;
    buyer: Buyer;
}

interface ListDetails {
    id: string;
    name: string;
    items: ListItem[];
}

export default function ListDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [list, setList] = useState<ListDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [selectedBuyerForSequence, setSelectedBuyerForSequence] = useState<string[] | null>(null);

    const fetchListDetails = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/lists/${id}`);
            if (res.ok) {
                const data = await res.json();
                setList(data);
            }
        } catch (error) {
            console.error("Failed to fetch list details", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListDetails();
    }, [id]);

    const handleRemoveBuyer = async (buyerId: string) => {
        if (!confirm("Are you sure you want to remove this buyer from the list?")) return;

        setRemovingId(buyerId);
        try {
            const res = await fetch(`http://localhost:5000/api/lists/${id}/buyers/${buyerId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setList(prev => prev ? {
                    ...prev,
                    items: prev.items.filter(item => item.buyer.id !== buyerId)
                } : null);
            }
        } catch (error) {
            console.error("Failed to remove buyer from list", error);
        } finally {
            setRemovingId(null);
        }
    };

    const handleSaveToCRM = async (buyerId: string) => {
        try {
            const res = await fetch('http://localhost:5000/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyerId, status: 'New Lead' })
            });

            if (res.ok) {
                alert("Successfully saved to CRM Pipeline!");
            } else {
                alert("Failed to save to CRM. It may already exist.");
            }
        } catch (error) {
            console.error("Error saving lead:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!list) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-zinc-900">List not found</h2>
                <Link href="/dashboard/lists" className="text-blue-600 hover:underline mt-4 inline-block">
                    Back to Saved Lists
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <Link href="/dashboard/lists" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-4 transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Lists
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{list.name}</h1>
                        <p className="text-zinc-600">{list.items.length} saved buyers in this list</p>
                    </div>
                    {list.items.length > 0 && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedBuyerForSequence(list.items.map(item => item.buyer.id))}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                <GitMerge className="w-4 h-4" /> Start Sequence
                            </button>
                            <ExportDropdown source="list" listId={list.id} />
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                {list.items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Location & Industry</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-100">
                                {list.items.map(({ buyer }) => (
                                    <tr key={buyer.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/dashboard/buyers/${buyer.id}`} className="font-medium text-zinc-900 hover:text-blue-600 transition">
                                                {buyer.companyName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900">{buyer.country}</div>
                                            <div className="text-xs text-zinc-500">{buyer.industry}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {buyer.email ? (
                                                <a href={`mailto:${buyer.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> Email
                                                </a>
                                            ) : (
                                                <span className="text-sm text-zinc-400">No email</span>
                                            )}
                                            {buyer.website && (
                                                <a href={buyer.website.startsWith('http') ? buyer.website : `https://${buyer.website}`} target="_blank" rel="noreferrer" className="block text-xs text-blue-600 hover:underline mt-1">
                                                    Website
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => handleSaveToCRM(buyer.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition"
                                                    title="Save to CRM"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedBuyerForSequence([buyer.id])}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition"
                                                    title="Start Sequence"
                                                >
                                                    <GitMerge className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/dashboard/email?to=${buyer.email || ''}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition"
                                                    title="Send Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleRemoveBuyer(buyer.id)}
                                                    disabled={removingId === buyer.id}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition"
                                                    title="Remove from List"
                                                >
                                                    {removingId === buyer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                        <Search className="w-12 h-12 text-zinc-300 mb-4" />
                        <p className="text-lg font-medium text-zinc-900">No buyers in this list yet</p>
                        <p className="mt-1 mb-4">Search the database to discover and add relevant buyers.</p>
                        <Link href="/dashboard/leads" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                            Find Buyers
                        </Link>
                    </div>
                )}
            </div>
            {selectedBuyerForSequence && (
                <StartSequenceModal
                    buyerIds={selectedBuyerForSequence}
                    onClose={() => setSelectedBuyerForSequence(null)}
                />
            )}
        </div>
    );
}
