"use client";

import { useState, useEffect } from "react";
import { Loader2, X, CheckCircle2 } from "lucide-react";

interface BuyerList {
    id: string;
    name: string;
}

interface SaveToListModalProps {
    buyerId: string;
    onClose: () => void;
}

export default function SaveToListModal({ buyerId, onClose }: SaveToListModalProps) {
    const [lists, setLists] = useState<BuyerList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedList, setSelectedList] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const res = await fetch("https://expo-impo-saas.onrender.com/api/lists");
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
        fetchLists();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedList) return;

        setIsSaving(true);
        setSuccessMessage("");

        try {
            const res = await fetch("https://expo-impo-saas.onrender.com/api/lists/add-buyer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listId: selectedList,
                    buyerId
                })
            });

            if (res.ok) {
                setSuccessMessage("Buyer successfully saved to list!");
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save buyer to list.");
            }
        } catch (error) {
            console.error("Failed to save to list", error);
            alert("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-zinc-900 mb-4">Save to List</h2>

                {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-6 text-green-600">
                        <CheckCircle2 className="w-12 h-12 mb-3" />
                        <p className="font-medium text-center">{successMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Select a list
                            </label>

                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                </div>
                            ) : lists.length > 0 ? (
                                <select
                                    required
                                    value={selectedList}
                                    onChange={(e) => setSelectedList(e.target.value)}
                                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="" disabled>Choose a list...</option>
                                    {lists.map(list => (
                                        <option key={list.id} value={list.id}>
                                            {list.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-sm text-zinc-500 p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
                                    You don't have any lists yet. Create one from the Saved Lists page.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6 pt-4 border-t border-zinc-100">
                            <button
                                type="submit"
                                disabled={isSaving || !selectedList || lists.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition w-full justify-center"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Save Buyer
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
