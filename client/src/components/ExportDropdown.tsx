"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";

interface ExportDropdownProps {
    source: "all" | "list" | "crm";
    listId?: string;
    searchQuery?: string;
    className?: string;
}

export default function ExportDropdown({ source, listId, searchQuery, className = "" }: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExport = (format: "csv" | "excel") => {
        // Build the URL with query parameters
        const url = new URL("http://localhost:5000/api/export/leads");
        url.searchParams.append("format", format);
        url.searchParams.append("source", source);

        if (listId) url.searchParams.append("listId", listId);
        if (searchQuery) url.searchParams.append("searchQuery", searchQuery);

        // Trigger the download via standard browser behavior
        window.open(url.toString(), "_blank");
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 transition-colors"
                id="export-menu-button"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Download className="w-4 h-4 text-zinc-500" />
                Export Leads
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="export-menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1 border-b border-zinc-100" role="none">
                        <button
                            onClick={() => handleExport("csv")}
                            className="text-zinc-700 group flex items-center px-4 py-3 text-sm hover:bg-zinc-50 w-full transition-colors"
                            role="menuitem"
                            tabIndex={-1}
                        >
                            <FileText className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-blue-500" aria-hidden="true" />
                            Export as CSV
                        </button>
                    </div>
                    <div className="py-1" role="none">
                        <button
                            onClick={() => handleExport("excel")}
                            className="text-zinc-700 group flex items-center px-4 py-3 text-sm hover:bg-zinc-50 w-full transition-colors"
                            role="menuitem"
                            tabIndex={-1}
                        >
                            <FileSpreadsheet className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-emerald-500" aria-hidden="true" />
                            Export as Excel (.xlsx)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
