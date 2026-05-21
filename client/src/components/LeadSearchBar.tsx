"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://expo-impo-saas.onrender.com";

interface SuggestionResponse {
    suggestions: string[];
    trending: string[];
}

export default function LeadSearchBar() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [trending, setTrending] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    // ── Click outside to close ──────────────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
                setActiveIndex(-1);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Load trending searches on mount ────────────────────────────────────
    useEffect(() => {
        const loadTrending = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/search-suggestions?q=`);
                if (res.ok) {
                    const data: SuggestionResponse = await res.json();
                    setTrending(data.trending || []);
                }
            } catch {
                // fallback silently
            }
        };
        loadTrending();
    }, []);

    // ── Fetch suggestions with 300ms debounce ───────────────────────────────
    const fetchSuggestions = useCallback(async (value: string) => {
        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_BASE}/api/search-suggestions?q=${encodeURIComponent(value.trim())}`
            );
            if (!res.ok) throw new Error("Failed to fetch");
            const data: SuggestionResponse = await res.json();
            setSuggestions(data.suggestions.slice(0, 6));
            setActiveIndex(-1);
        } catch {
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => fetchSuggestions(value), 300);
    };

    // ── Keyboard navigation ─────────────────────────────────────────────────
    const activeList = query.trim().length >= 2 ? suggestions : trending;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) {
            if (e.key === "Enter") handleSearch(query);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, activeList.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < activeList.length) {
                selectSuggestion(activeList[activeIndex]);
            } else {
                handleSearch(query);
            }
        } else if (e.key === "Escape") {
            setShowDropdown(false);
            setActiveIndex(-1);
        }
    };

    // ── Search / navigate ───────────────────────────────────────────────────
    const handleSearch = (q: string) => {
        if (!q.trim()) return;
        setShowDropdown(false);
        setActiveIndex(-1);
        window.open(`/search?q=${encodeURIComponent(q.trim())}`, '_blank');
    };

    const selectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowDropdown(false);
        setActiveIndex(-1);
        window.open(`/search?q=${encodeURIComponent(suggestion)}`, '_blank');
    };

    // ── Display state ───────────────────────────────────────────────────────
    const showLiveSuggestions = query.trim().length >= 2 && suggestions.length > 0;
    const showTrending = query.trim().length < 2 && trending.length > 0;
    const isOpen = showDropdown && (showLiveSuggestions || showTrending || isLoading);

    return (
        <div className="w-full flex justify-center mb-10">
            <div ref={containerRef} className="relative w-full max-w-[640px]">

                {/* ── Search Bar ── */}
                <div
                    className="flex items-center bg-white px-4 py-3 border border-zinc-200 transition-all duration-200"
                    style={{
                        borderRadius: isOpen ? "22px 22px 0 0" : "9999px",
                        boxShadow: isFocused
                            ? "0 1px 6px rgba(32,33,36,0.28)"
                            : "0 1px 3px rgba(0,0,0,0.12)",
                    }}
                >
                    <Search className="text-zinc-400 mr-3 flex-shrink-0" size={20} />

                    <input
                        suppressHydrationWarning
                        type="text"
                        placeholder="Search buyers globally... (e.g. fertilizer buyers UAE)"
                        className="flex-1 outline-none text-gray-700 bg-transparent text-[15px] placeholder:text-zinc-400"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            setIsFocused(true);
                            setShowDropdown(true);
                        }}
                    />

                    {/* Clear button when typing */}
                    {query && (
                        <button
                            onMouseDown={(e) => { e.preventDefault(); setQuery(""); setSuggestions([]); }}
                            className="text-zinc-300 hover:text-zinc-500 transition-colors mr-2 text-xl leading-none"
                            aria-label="Clear"
                        >
                            ×
                        </button>
                    )}

                    <button
                        suppressHydrationWarning
                        onClick={() => handleSearch(query)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors ml-1 shrink-0"
                        aria-label="Search"
                    >
                        Search
                    </button>
                </div>

                {/* ── Dropdown ── */}
                {isOpen && (
                    <div
                        className="absolute left-0 right-0 bg-white border border-t-0 border-zinc-200 z-50 overflow-hidden"
                        style={{
                            borderRadius: "0 0 22px 22px",
                            boxShadow: "0 4px 12px rgba(32,33,36,0.2)",
                            maxHeight: "360px",
                            overflowY: "auto",
                        }}
                    >
                        {/* Thin divider */}
                        <div className="mx-4 border-t border-zinc-100" />

                        {/* Loading state */}
                        {isLoading && (
                            <div className="px-5 py-3 text-sm text-zinc-400 flex items-center gap-3">
                                <Search size={15} className="animate-pulse text-zinc-300" />
                                Finding suggestions...
                            </div>
                        )}

                        {/* Live query suggestions */}
                        {!isLoading && showLiveSuggestions && (
                            <ul className="py-1">
                                {suggestions.map((suggestion, index) => {
                                    const isActive = index === activeIndex;
                                    // Split into main keyword + location for styled display
                                    const locationKeywords = [
                                        "uae", "uk", "usa", "germany", "saudi arabia", "india",
                                        "china", "france", "italy", "spain", "brazil", "canada",
                                        "australia", "europe", "qatar", "oman", "kuwait", "turkey",
                                        "united arab emirates", "united kingdom", "united states"
                                    ];
                                    const parts = suggestion.split(/\s+/);
                                    let splitIdx = parts.length;
                                    for (let i = 0; i < parts.length; i++) {
                                        if (locationKeywords.includes(parts[i].toLowerCase())) {
                                            splitIdx = i;
                                            break;
                                        }
                                    }
                                    const mainText = parts.slice(0, splitIdx).join(" ");
                                    const locationText = parts.slice(splitIdx).join(" ");

                                    return (
                                        <li
                                            key={index}
                                            onMouseDown={(e) => { e.preventDefault(); selectSuggestion(suggestion); }}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(-1)}
                                            className="flex items-center px-5 cursor-pointer transition-colors duration-100"
                                            style={{
                                                padding: "11px 20px",
                                                backgroundColor: isActive ? "#f1f3f4" : "transparent",
                                            }}
                                        >
                                            <Search size={16} className="flex-shrink-0 mr-4 text-zinc-400" />
                                            <span className="text-[14px] text-zinc-800">
                                                {mainText}
                                                {locationText && (
                                                    <span className="text-zinc-400 ml-1">{locationText}</span>
                                                )}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {/* ── Trending Searches (shown when input is empty) ── */}
                        {!isLoading && showTrending && (
                            <div className="py-1">
                                <div className="flex items-center gap-2 px-5 pt-2 pb-1">
                                    <TrendingUp size={13} className="text-zinc-400" />
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Trending Searches
                                    </span>
                                </div>
                                <ul>
                                    {trending.slice(0, 6).map((item, index) => {
                                        const isActive = index === activeIndex;
                                        return (
                                            <li
                                                key={index}
                                                onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onMouseLeave={() => setActiveIndex(-1)}
                                                className="flex items-center cursor-pointer transition-colors duration-100"
                                                style={{
                                                    padding: "10px 20px",
                                                    backgroundColor: isActive ? "#f1f3f4" : "transparent",
                                                }}
                                            >
                                                <Clock size={15} className="flex-shrink-0 mr-4 text-zinc-400" />
                                                <span className="text-[14px] text-zinc-700">{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* No results */}
                        {!isLoading && query.trim().length >= 2 && suggestions.length === 0 && (
                            <div className="px-5 py-4 text-sm text-zinc-400">
                                No suggestions for <span className="font-medium text-zinc-600">"{query}"</span>. Press Enter to search.
                            </div>
                        )}

                        <div className="h-2" />
                    </div>
                )}
            </div>
        </div>
    );
}
