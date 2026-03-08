"use client";

import { useState, useEffect } from "react";
import { Loader2, X, CheckCircle2, Play, GitMerge } from "lucide-react";

interface EmailSequence {
    id: string;
    name: string;
    steps: any[];
}

interface StartSequenceModalProps {
    buyerIds: string[];
    onClose: () => void;
}

export default function StartSequenceModal({ buyerIds, onClose }: StartSequenceModalProps) {
    const [sequences, setSequences] = useState<EmailSequence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const [selectedSequence, setSelectedSequence] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchSequences = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/email-sequences");
                if (res.ok) {
                    const data = await res.json();
                    setSequences(data);
                }
            } catch (error) {
                console.error("Failed to fetch sequences", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSequences();
    }, []);

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSequence || buyerIds.length === 0) return;

        setIsStarting(true);
        setSuccessMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/email-sequences/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sequenceId: selectedSequence,
                    buyerIds
                })
            });

            if (res.ok) {
                setSuccessMessage("Sequence successfully started!");
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to start sequence.");
            }
        } catch (error) {
            console.error("Failed to start sequence", error);
            alert("An error occurred");
        } finally {
            setIsStarting(false);
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

                <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <GitMerge className="w-5 h-5 text-blue-500" />
                    Start Email Sequence
                </h2>

                <p className="text-sm text-zinc-500 mb-4">
                    Enroll {buyerIds.length} {buyerIds.length === 1 ? 'buyer' : 'buyers'} into an automated email sequence.
                </p>

                {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-6 text-green-600">
                        <CheckCircle2 className="w-12 h-12 mb-3" />
                        <p className="font-medium text-center">{successMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleStart}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Select a Sequence
                            </label>

                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                </div>
                            ) : sequences.length > 0 ? (
                                <select
                                    required
                                    value={selectedSequence}
                                    onChange={(e) => setSelectedSequence(e.target.value)}
                                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="" disabled>Choose a sequence...</option>
                                    {sequences.map(seq => (
                                        <option key={seq.id} value={seq.id}>
                                            {seq.name} ({seq.steps?.length || 0} steps)
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-sm text-zinc-500 p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
                                    You don't have any sequences yet. Create one from the Email Sequences page.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6 pt-4 border-t border-zinc-100">
                            <button
                                type="submit"
                                disabled={isStarting || !selectedSequence || sequences.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition w-full justify-center"
                            >
                                {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                Start Sequence
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
