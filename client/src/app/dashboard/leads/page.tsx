"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LeadSearchBar from "@/components/LeadSearchBar";
import TopBuyerCard from "@/components/TopBuyerCard";
import {
    Search,
    MapPin,
    Briefcase,
    Mail,
    Building,
    Globe,
    UserPlus,
    Loader2,
    Linkedin,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    ListPlus,
    GitMerge
} from "lucide-react";
import SaveToListModal from "@/components/SaveToListModal";
import ExportDropdown from "@/components/ExportDropdown";
import StartSequenceModal from "@/components/StartSequenceModal";

function LeadsPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
    const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
    const [selectedBuyerForList, setSelectedBuyerForList] = useState<string | null>(null);
    const [selectedBuyerForSequence, setSelectedBuyerForSequence] = useState<string | null>(null);

    // ── Top Performing Buyers state ──────────────────────────────────────────
    const [topBuyers, setTopBuyers] = useState<any[]>([]);
    const [topFilters, setTopFilters] = useState({ country: '', industry: '', productCategory: '' });
    const [topLoading, setTopLoading] = useState(false);
    const [savedTopLeads, setSavedTopLeads] = useState<Set<string>>(new Set());
    const [savingTopLeadId, setSavingTopLeadId] = useState<string | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                setHasSearched(true);
                setIsLoading(true);
                try {
                    const response = await fetch(`https://expo-impo-saas.onrender.com/api/buyers/search?q=${encodeURIComponent(query)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setResults(data);
                    } else {
                        console.error("Failed to fetch search results");
                        setResults([]);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setHasSearched(false);
                setResults([]);
            }
        };

        setCurrentPage(1); // Reset page on new search
        fetchResults();
    }, [query]);

    // ── Fetch Top Performing Buyers ──────────────────────────────────────────
    useEffect(() => {
        const loadTopBuyers = async () => {
            setTopLoading(true);
            try {
                const params = new URLSearchParams();
                if (topFilters.country) params.set('country', topFilters.country);
                if (topFilters.industry) params.set('industry', topFilters.industry);
                if (topFilters.productCategory) params.set('productCategory', topFilters.productCategory);
                const url = `https://expo-impo-saas.onrender.com/api/buyers/top-performing?${params.toString()}`;
                const res = await fetch(url);
                if (res.ok) setTopBuyers(await res.json());
            } catch { /* silently fail */ }
            finally { setTopLoading(false); }
        };
        loadTopBuyers();
    }, [topFilters]);

    const handleSaveTopLead = async (buyerId: string) => {
        setSavingTopLeadId(buyerId);
        try {
            const res = await fetch('https://expo-impo-saas.onrender.com/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyerId, status: 'New Lead' })
            });
            if (res.ok) setSavedTopLeads(prev => new Set(prev).add(buyerId));
        } catch { /* fail silently */ }
        finally { setSavingTopLeadId(null); }
    };


    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedResults = useMemo(() => {
        let sortableItems = [...results];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = (a[sortConfig.key] || "").toString().toLowerCase();
                const bValue = (b[sortConfig.key] || "").toString().toLowerCase();
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [results, sortConfig]);

    const currentData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return sortedResults.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, sortedResults]);

    const handleSaveLead = async (buyerId: string) => {
        try {
            setSavingLeadId(buyerId);
            const response = await fetch('https://expo-impo-saas.onrender.com/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyerId,
                    status: 'New Lead'
                })
            });

            if (response.ok) {
                setSavedLeads(prev => new Set(prev).add(buyerId));
            } else {
                console.error("Failed to save lead");
            }
        } catch (error) {
            console.error("Error saving lead:", error);
        } finally {
            setSavingLeadId(null);
        }
    };

    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Lead Generation Engine</h1>
                <p className="text-zinc-600">Discover international buyers using natural language AI search. Type what you are looking for.</p>
            </div>

            {/* AI Search Bar */}
            <LeadSearchBar />

            {/* ── Top Performing Buyers (shown only when no search is active) ── */}
            {!hasSearched && (
                <div className="mt-2">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900">Top Performing Buyers</h2>
                            <p className="text-sm text-zinc-500 mt-0.5">Based on verified trade activity &amp; lead quality score</p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={topFilters.country}
                                onChange={e => setTopFilters(f => ({ ...f, country: e.target.value }))}
                                className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white text-zinc-700 outline-none focus:border-blue-400 cursor-pointer"
                            >
                                <option value="">All Countries</option>
                                {["United Arab Emirates", "Saudi Arabia", "Germany", "India", "United Kingdom", "USA","China","France"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <select
                                value={topFilters.industry}
                                onChange={e => setTopFilters(f => ({ ...f, industry: e.target.value }))}
                                className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white text-zinc-700 outline-none focus:border-blue-400 cursor-pointer"
                            >
                                <option value="">All Industries</option>
                                {["Agriculture", "Textile", "Electronics", "Pharmaceutical", "Food", "Chemical", "Furniture"].map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                            <select
                                value={topFilters.productCategory}
                                onChange={e => setTopFilters(f => ({ ...f, productCategory: e.target.value }))}
                                className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white text-zinc-700 outline-none focus:border-blue-400 cursor-pointer"
                            >
                                <option value="">All Products</option>
                                {["Fertilizer","Rice","Spice","Textile","Electronics","Machinery","Chemicals"].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            {(topFilters.country || topFilters.industry || topFilters.productCategory) && (
                                <button
                                    onClick={() => setTopFilters({ country: '', industry: '', productCategory: '' })}
                                    className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 bg-blue-50 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    {topLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : topBuyers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {topBuyers.map((buyer) => (
                                <TopBuyerCard
                                    key={buyer.id}
                                    buyer={buyer}
                                    onSave={handleSaveTopLead}
                                    isSaving={savingTopLeadId === buyer.id}
                                    isSaved={savedTopLeads.has(buyer.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-2xl">
                            <p className="font-medium">No top buyers found for these filters.</p>
                            <p className="text-sm mt-1">Try clearing filters or adding more buyer data to your database.</p>
                        </div>
                    )}
                </div>
            )}

            {hasSearched && (
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
                        <h3 className="font-semibold text-zinc-900">
                            Search Results for: <span className="font-normal text-zinc-500">&quot;{query}&quot;</span>
                        </h3>
                        {!isLoading && (
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700">
                                    {results.length} found
                                </span>
                                {results.length > 0 && (
                                    <ExportDropdown source="all" searchQuery={query || undefined} />
                                )}
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                            <p>Analyzing query and searching database...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-white">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Company</th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-50 group transition-colors"
                                                onClick={() => handleSort('country')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Country <ArrowUpDown className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-50 group transition-colors"
                                                onClick={() => handleSort('industry')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Industry <ArrowUpDown className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Website</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">LinkedIn</th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-50 group transition-colors"
                                                onClick={() => handleSort('verificationScore')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Lead Score <ArrowUpDown className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-zinc-200">
                                        {currentData.map((buyer) => (
                                            <tr key={buyer.id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={`/dashboard/buyers/${buyer.id}`} className="block hover:bg-zinc-50 transition-colors rounded-lg -m-2 p-2 group">
                                                        <div className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">
                                                            {buyer.companyName}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                                                    {buyer.country}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                                                    {buyer.industry}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                    {buyer.website ? (
                                                        <a href={buyer.website.startsWith('http') ? buyer.website : `https://${buyer.website}`} target="_blank" rel="noreferrer" className="hover:underline">Visit</a>
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                                                    {buyer.email || <span className="text-zinc-400">-</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                    {buyer.linkedin ? (
                                                        <a href={buyer.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline"><Linkedin className="w-4 h-4" /> Profile</a>
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold
                                                        ${(buyer.verificationScore || 0) >= 8 ? 'bg-green-50 text-green-700 border border-green-200' :
                                                            (buyer.verificationScore || 0) >= 5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                                                'bg-red-50 text-red-700 border border-red-200'
                                                        }`}>
                                                        {buyer.verificationScore || 0} / 10
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <button
                                                            suppressHydrationWarning
                                                            onClick={() => setSelectedBuyerForList(buyer.id)}
                                                            className="inline-flex justify-center items-center rounded-lg bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 transition-colors gap-1"
                                                            title="Save to List"
                                                        >
                                                            <ListPlus className="w-3.5 h-3.5" /> List
                                                        </button>
                                                        <button
                                                            suppressHydrationWarning
                                                            onClick={() => setSelectedBuyerForSequence(buyer.id)}
                                                            className="inline-flex justify-center items-center rounded-lg bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 transition-colors gap-1"
                                                            title="Start Sequence"
                                                        >
                                                            <GitMerge className="w-3.5 h-3.5 text-blue-500" /> Sequence
                                                        </button>
                                                        {savedLeads.has(buyer.id) ? (
                                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700">
                                                                CRM Saved
                                                            </span>
                                                        ) : (
                                                            <button
                                                                suppressHydrationWarning
                                                                onClick={() => handleSaveLead(buyer.id)}
                                                                disabled={savingLeadId === buyer.id}
                                                                className="inline-flex justify-center items-center rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 disabled:opacity-50 transition-colors gap-1"
                                                                title="Save to CRM"
                                                            >
                                                                {savingLeadId === buyer.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "CRM"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-3 sm:px-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-zinc-700">
                                                Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedResults.length)}</span> of{' '}
                                                <span className="font-medium">{results.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                                {/* Simple pagination logic for demo, showing current page */}
                                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:z-20 focus:outline-offset-0">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                            <Search className="w-12 h-12 text-zinc-300 mb-4" />
                            <p className="text-lg font-medium text-zinc-900">No buyers found</p>
                            <p className="mt-1">Try modifying your query or specifying a different industry or country.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedBuyerForList && (
                <SaveToListModal
                    buyerId={selectedBuyerForList}
                    onClose={() => setSelectedBuyerForList(null)}
                />
            )}

            {selectedBuyerForSequence && (
                <StartSequenceModal
                    buyerIds={[selectedBuyerForSequence]}
                    onClose={() => setSelectedBuyerForSequence(null)}
                />
            )}
        </div>
    );
}

export default function LeadsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <LeadsPageContent />
        </Suspense>
    );
}
