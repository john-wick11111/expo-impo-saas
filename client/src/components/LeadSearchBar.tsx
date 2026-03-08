"use client";

import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeadSearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        console.log("Searching:", query);

        // Navigate to the leads page with the query parameter
        router.push(`/dashboard/leads?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="w-full flex justify-center mb-10">

            <div className="flex items-center bg-white shadow-md rounded-full px-4 py-3 w-[600px] border border-zinc-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">

                <Search className="text-zinc-400 mr-3" size={22} />

                <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Search buyers globally... (e.g. fertilizer importers UAE)"
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />

                <button suppressHydrationWarning onClick={handleSearch} className="hover:bg-zinc-100 p-2 rounded-full transition-colors ml-2">
                    <Mic className="text-zinc-400 hover:text-blue-500" size={22} />
                </button>

            </div>

        </div>
    );
}
