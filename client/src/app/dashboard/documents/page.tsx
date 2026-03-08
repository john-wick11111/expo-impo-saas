"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import {
    FileText,
    Download,
    FileCheck,
    Building,
    User,
    ShoppingBag
} from "lucide-react";

export default function DocumentGeneratorPage() {
    const [docType, setDocType] = useState("Proforma Invoice");
    const [buyerName, setBuyerName] = useState("");
    const [buyerAddress, setBuyerAddress] = useState("");
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [unitPrice, setUnitPrice] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(37, 99, 235); // Blue
            doc.text("Expo&Impo Exports", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("123 Export Business Park, Suite 400", 14, 26);
            doc.text("Global Trade City, 10001", 14, 31);

            // Document Title
            doc.setFontSize(18);
            doc.setTextColor(0);
            doc.text(docType.toUpperCase(), 14, 45);

            // Invoice Details
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 45);
            doc.text(`Doc Ref: EXP-${Math.floor(1000 + Math.random() * 9000)}`, 150, 50);

            // Bill To
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Bill To:", 14, 65);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.text(buyerName || "Client Name", 14, 72);

            const splitAddress = doc.splitTextToSize(buyerAddress || "Client Address", 60);
            doc.text(splitAddress, 14, 78);

            // Table Header
            doc.setFillColor(243, 244, 246);
            doc.rect(14, 100, 182, 10, "F");
            doc.setFont("helvetica", "bold");
            doc.text("Description", 16, 107);
            doc.text("Qty", 120, 107);
            doc.text("Unit Price", 145, 107);
            doc.text("Total", 175, 107);

            // Table Content
            doc.setFont("helvetica", "normal");
            doc.text(productName || "Product Name", 16, 117);
            doc.text(quantity || "1", 120, 117);
            doc.text(`$${unitPrice || "0.00"}`, 145, 117);

            const q = parseFloat(quantity) || 1;
            const p = parseFloat(unitPrice) || 0;
            const total = (q * p).toFixed(2);

            doc.text(`$${total}`, 175, 117);

            // Total Calculation
            doc.line(14, 125, 196, 125); // Draw line
            doc.setFont("helvetica", "bold");
            doc.text("Grand Total:", 145, 135);
            doc.setTextColor(37, 99, 235);
            doc.text(`$${total}`, 175, 135);

            // Footer Terms
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("Terms & Conditions:", 14, 160);
            const terms = docType === "Proforma Invoice"
                ? "This is a proforma invoice. Goods will be dispatched upon receipt of payment."
                : "Payment is due within 30 days. Thank you for your business.";
            doc.text(doc.splitTextToSize(terms, 182), 14, 165);

            // Save
            doc.save(`${docType.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("PDF Generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Export Document Generator</h1>
                <p className="text-zinc-600 mt-1">Easily create standard Proforma and Commercial invoices for your buyers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={generatePDF} className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
                                <FileText className="w-5 h-5 text-blue-600" /> Document Details
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Document Type</label>
                                <select
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    className="block w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl transition-colors"
                                >
                                    <option value="Proforma Invoice">Proforma Invoice</option>
                                    <option value="Commercial Invoice">Commercial Invoice</option>
                                    <option value="Packing List">Packing List</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Buyer/Company Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            className="block w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="e.g. AgriTech Global LLC"
                                            value={buyerName}
                                            onChange={(e) => setBuyerName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Buyer Address</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="text"
                                            className="block w-full px-3 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="e.g. 123 Sheikh Zayed Rd, Dubai, UAE"
                                            value={buyerAddress}
                                            onChange={(e) => setBuyerAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
                                <ShoppingBag className="w-5 h-5 text-blue-600" /> Product Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Product Description</label>
                                    <input
                                        required
                                        type="text"
                                        className="block w-full px-3 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g. Organic Urea Fertilizer 50kg Bags"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="block w-full px-3 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Unit Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="block w-full px-3 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g. 15.50"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-md"
                            >
                                {isGenerating ? (
                                    <>Generating...</>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Generate & Download PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-md p-6 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <FileCheck className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Professional Invoices</h3>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                            Generate compliant export documents instantly. All documents include standard formatting suitable for international trade and customs clearance.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
                        <h3 className="font-semibold text-zinc-900 mb-3 text-sm uppercase tracking-wider">Document Required for:</h3>
                        <ul className="space-y-3 text-sm text-zinc-600">
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                Customs clearance in importing countries
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                Bank transactions and Letter of Credits (LC)
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                Freight forwarding and logistics planning
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
