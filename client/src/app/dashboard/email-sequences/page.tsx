"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Mail, Clock } from "lucide-react";

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

export default function EmailSequencesPage() {
    const [sequences, setSequences] = useState<EmailSequence[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [steps, setSteps] = useState<EmailSequenceStep[]>([
        { subject: "", body: "", delayDays: 0 }
    ]);

    useEffect(() => {
        fetchSequences();
    }, []);

    const fetchSequences = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/email-sequences");
            const data = await res.json();
            setSequences(data);
        } catch (error) {
            console.error("Failed to fetch sequences", error);
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSequence(null);
    };

    const handleAddStep = () => {
        setSteps([...steps, { subject: "", body: "", delayDays: 1 }]);
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    const handleStepChange = (index: number, field: keyof EmailSequenceStep, value: any) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
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

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, steps })
            });

            if (res.ok) {
                fetchSequences();
                handleCloseModal();
            } else {
                alert("Failed to save sequence");
            }
        } catch (error) {
            console.error("Error saving sequence", error);
            alert("Error saving sequence");
        }
    };

    const handleDeleteSequence = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sequence?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/email-sequences/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchSequences();
            } else {
                alert("Failed to delete sequence");
            }
        } catch (error) {
            console.error("Error deleting sequence", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Email Sequences</h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        Create automated multi-step email campaigns to follow up with buyers.
                    </p>
                </div>
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
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-zinc-500">Loading sequences...</p>
                </div>
            ) : sequences.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200">
                    <Mail className="mx-auto h-12 w-12 text-zinc-300" />
                    <h3 className="mt-4 text-sm font-medium text-zinc-900">No sequences created</h3>
                    <p className="mt-1 text-sm text-zinc-500">Get started by creating a new email sequence.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Sequence Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Steps
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Metrics
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white">
                            {sequences.map((sequence) => (
                                <tr key={sequence.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-zinc-900">{sequence.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {sequence.steps?.length || 0} Steps
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                        {new Date(sequence.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                        <div className="flex flex-col gap-0.5 text-xs">
                                            <span>Sent: <span className="font-semibold text-blue-600">{sequence.metrics?.sent || 0}</span></span>
                                            <span>Opened: <span className="font-semibold text-zinc-900">{sequence.metrics?.opened || 0}</span></span>
                                            <span>Replied: <span className="font-semibold text-green-600">{sequence.metrics?.replied || 0}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleOpenModal(sequence)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSequence(sequence.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
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

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-xl">
                        <div className="p-6 border-b border-zinc-200 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                {editingSequence ? "Edit Sequence" : "Create Sequence"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600">
                                <Trash2 className="w-5 h-5 hidden" /> {/* Hidden placeholder for balance */}
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
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
                                    <button
                                        type="button"
                                        onClick={handleAddStep}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Step
                                    </button>
                                </div>

                                {steps.map((step, index) => (
                                    <div key={index} className="pl-4 pr-6 py-4 bg-zinc-50 border border-zinc-200 rounded-xl relative space-y-4">
                                        {steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStep(index)}
                                                className="absolute top-4 right-4 text-zinc-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-zinc-200 text-zinc-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                                                {index + 1}
                                            </span>
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
                                                    placeholder="Hi [Name],\n\n..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-zinc-500 mb-1">Delay (Days)</label>
                                                <div className="relative">
                                                    <Clock className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                                                    <input
                                                        type="number"
                                                        min={0}
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
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSequence}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none"
                            >
                                Save Sequence
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
