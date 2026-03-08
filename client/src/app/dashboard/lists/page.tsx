"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, List as ListIcon, Loader2, ArrowRight } from "lucide-react";

interface BuyerList {
    id: string;
    name: string;
    createdAt: string;
    buyersCount: number;
}

export default function SavedListsPage() {
    const [lists, setLists] = useState<BuyerList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/lists");
            if (res.ok) {
                const data = await res.json();
                setLists(data);
            }
        } catch (error) {
            console.error("Failed to fetch lists", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;

        setIsCreating(true);
        try {
            const res = await fetch("http://localhost:5000/api/lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newListName.trim() })
            });

            if (res.ok) {
                setNewListName("");
                setIsCreateModalOpen(false);
                fetchLists();
            }
        } catch (error) {
            console.error("Failed to create list", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Saved Lists</h1>
                    <p className="text-zinc-600">Organize and manage your curated lists of international buyers.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Create New List
                </button>
            </div>

            {/* Lists Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : lists.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">List Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Buyers Count</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-100">
                                {lists.map((list) => (
                                    <tr key={list.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <ListIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-zinc-900">{list.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                                                {list.buyersCount} buyers
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/dashboard/lists/${list.id}`}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                View <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                        <ListIcon className="w-12 h-12 text-zinc-300 mb-4" />
                        <p className="text-lg font-medium text-zinc-900">No saved lists yet</p>
                        <p className="mt-1">Create your first list to start organizing buyers.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
                        <h2 className="text-xl font-bold text-zinc-900 mb-4">Create New List</h2>
                        <form onSubmit={handleCreateList}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-zinc-700 mb-1">
                                    List Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="e.g. UAE Fertilizer Buyers"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || !newListName.trim()}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition"
                                >
                                    {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Create List
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
