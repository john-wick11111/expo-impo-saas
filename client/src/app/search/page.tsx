"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Globe, Mail, MapPin, Briefcase, Star, Search, Save, UserCircle, LayoutGrid, List } from "lucide-react";
import LeadSearchBar from "@/components/LeadSearchBar";
import BuyerCard from "@/components/BuyerCard";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
    const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) return;

            setIsLoading(true);
            try {
                // Reusing the buyers search API
                const response = await fetch(`https://expo-impo-saas.onrender.com/api/buyers/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleSaveLead = async (buyerId: string) => {
        try {
            setSavingLeadId(buyerId);
            const response = await fetch('https://expo-impo-saas.onrender.com/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyerId, status: 'New Lead' })
            });

            if (response.ok) {
                setSavedLeads(prev => new Set(prev).add(buyerId));
            }
        } catch (error) {
            console.error("Error saving lead:", error);
        } finally {
            setSavingLeadId(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">

            {/* ── Centered Search Bar Header ── */}
            <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
                    <div className="w-full max-w-[640px]">
                        <LeadSearchBar />
                    </div>
                </div>
            </header>

            {/* Results Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 pb-4 border-b border-zinc-200 flex justify-between items-center">
                    <p className="text-sm text-zinc-500">
                        {isLoading ? "Searching database..." : `About ${results.length} results for "${query}"`}
                    </p>
                    {results.length > 0 && (
                        <div className="flex bg-zinc-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                                title="Card View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                                title="Table View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                        <p>Loading results...</p>
                    </div>
                ) : results.length > 0 ? (
                    viewMode === 'card' ? (
                        // ── 3-column card grid ──
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {results.map((buyer) => (
                                <BuyerCard
                                    key={buyer.id}
                                    buyer={buyer}
                                    onSave={handleSaveLead}
                                    isSaving={savingLeadId === buyer.id}
                                    isSaved={savedLeads.has(buyer.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-zinc-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Company</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Country</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Industry</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Website</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Lead Score</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-zinc-200">
                                        {results.map((buyer) => (
                                            <tr key={buyer.id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={`/dashboard/buyers/${buyer.id}`} className="font-medium text-blue-600 hover:underline">
                                                        {buyer.companyName}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{buyer.country || "-"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{buyer.industry || "-"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                    {buyer.website ? (
                                                        <a href={buyer.website.startsWith('http') ? buyer.website : `https://${buyer.website}`} target="_blank" rel="noreferrer" className="hover:underline">Visit</a>
                                                    ) : <span className="text-zinc-400">-</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{buyer.email || "-"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold
                                                        ${(buyer.verificationScore || 0) >= 8 ? 'bg-green-50 text-green-700 border border-green-200' :
                                                            (buyer.verificationScore || 0) >= 5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                                                'bg-red-50 text-red-700 border border-red-200'
                                                        }`}>
                                                        {buyer.verificationScore || 0}/10
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {savedLeads.has(buyer.id) ? (
                                                        <span className="inline-flex justify-center items-center px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg">
                                                            Saved
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link href={`/dashboard/buyers/${buyer.id}`} className="text-blue-600 hover:underline mr-2 text-xs">
                                                                Profile
                                                            </Link>
                                                            <button
                                                                onClick={() => handleSaveLead(buyer.id)}
                                                                disabled={savingLeadId === buyer.id}
                                                                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                {savingLeadId === buyer.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                                Save
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : query ? (
                    <div className="py-20 text-center text-zinc-500 flex flex-col items-center">
                        <Search className="w-12 h-12 text-zinc-300 mb-4" />
                        <p className="text-lg text-zinc-900 font-medium pb-2">No buyers found for this query. Try another product or country.</p>
                        <ul className="text-left list-disc pl-5 space-y-1 text-sm bg-zinc-100 p-4 rounded-lg mt-2">
                            <li>Make sure all words are spelled correctly.</li>
                            <li>Try different keywords or locations.</li>
                        </ul>
                    </div>
                ) : (
                    <div className="py-20 text-center text-zinc-500">
                        <p>Type a query to search for international leads.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
