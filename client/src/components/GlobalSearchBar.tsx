"use client";

import React, { KeyboardEvent, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

// useDebounce custom hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface GlobalSearchBarProps {
    placeholder?: string;
    showButton?: boolean;
    className?: string;
}

export function GlobalSearchBar({
    placeholder = "Search buyers globally... (e.g. fertilizer buyers UAE)",
    showButton = true,
    className = "",
}: GlobalSearchBarProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Fetch live suggestions when debounced query changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const res = await fetch(`http://localhost:5000/api/buyers/suggestions?q=${encodeURIComponent(debouncedQuery.trim())}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                    } else {
                        setSuggestions([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch suggestions:", error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    const handleSearch = (searchQuery: string = query) => {
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                // If user highlighted a suggestion via arrows, select it instead of searching the raw text
                handleSuggestionClick(suggestions[activeIndex]);
            } else {
                handleSearch();
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (showSuggestions && suggestions.length > 0) {
                setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (showSuggestions && suggestions.length > 0) {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setActiveIndex(-1);
        handleSearch(suggestion);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={`relative flex w-full flex-col sm:flex-row items-center gap-2 sm:gap-3 ${className}`}>
            <div className="relative flex flex-1 w-full items-center">
                <Search className="absolute left-3 h-5 w-5 text-zinc-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {/* Autocomplete Dropdown */}
                {showSuggestions && (suggestions.length > 0 || isLoading) && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-200 bg-white shadow-lg overflow-hidden max-h-80">
                        {isLoading && query.length >= 2 ? (
                            <div className="px-4 py-3 text-sm text-zinc-500 flex items-center gap-2">
                                <Search className="w-4 h-4 text-zinc-300 animate-pulse" />
                                Loading suggestions...
                            </div>
                        ) : suggestions.length > 0 ? (
                            <ul className="py-2">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-3 transition-colors ${activeIndex === index ? "bg-zinc-100/80 text-blue-700" : "text-zinc-700 hover:bg-zinc-50"
                                            }`}
                                    >
                                        <div className={`p-1 rounded-md shrink-0 ${activeIndex === index ? "bg-blue-100" : "bg-zinc-100"}`}>
                                            <Search className={`w-3.5 h-3.5 ${activeIndex === index ? "text-blue-600" : "text-zinc-400"}`} />
                                        </div>
                                        <span className={`truncate ${activeIndex === index ? "font-medium" : ""}`}>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )}
            </div>
            {showButton && (
                <button
                    onClick={() => handleSearch()}
                    className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                    Search
                </button>
            )}
        </div>
    );
}

export default GlobalSearchBar;
