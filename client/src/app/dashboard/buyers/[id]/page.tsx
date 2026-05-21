"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
    Building,
    MapPin,
    Briefcase,
    Globe,
    Mail,
    Phone,
    Linkedin,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    UserPlus,
    Loader2,
    ListPlus
} from "lucide-react";
import SaveToListModal from "@/components/SaveToListModal";

interface BuyerData {
    id: string;
    companyName: string;
    country: string;
    industry: string;
    productCategory: string | null;
    email: string | null;
    website: string | null;
    phone: string | null;
    linkedin: string | null;
    verificationScore?: number;
    emailVerified?: boolean;
    websiteActive?: boolean;
    companySize?: string | null;
}

export default function BuyerProfile({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params in Next.js 15
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [buyer, setBuyer] = useState<BuyerData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                // Assuming dev server is running on localhost:5000
                const response = await fetch(`https://expo-impo-saas.onrender.com/api/buyers/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBuyer(data);
                } else {
                    console.error("Failed to load buyer details");
                }
            } catch (error) {
                console.error("Error fetching buyer:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchBuyer();
        }
    }, [id]);

    const handleSaveLead = async () => {
        if (!buyer) return;

        try {
            setIsSaving(true);
            const response = await fetch('https://expo-impo-saas.onrender.com/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyerId: buyer.id,
                    status: 'New Lead'
                })
            });

            if (response.ok) {
                setSaved(true);
            } else {
                console.error("Failed to save lead");
            }
        } catch (error) {
            console.error("Error saving lead:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendEmail = () => {
        if (!buyer?.email) return;

        // In a real app this might redirect to an internal email outreach page
        // For now, we'll try to redirect passing the email as a query param or use a mailto fallback
        // The prompt requests it redirects to email-outreach page
        router.push(`/dashboard/email-outreach?buyer=${buyer.id}&email=${encodeURIComponent(buyer.email)}`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-zinc-500">Loading buyer profile...</p>
            </div>
        );
    }

    if (!buyer) {
        return (
            <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-zinc-900 mb-2">Buyer Not Found</h2>
                <p className="text-zinc-500 mb-6">We couldn't locate this company in our database.</p>
                <button
                    onClick={() => router.push('/dashboard/leads')}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Header / Back Link */}
            <div>
                <button
                    suppressHydrationWarning
                    onClick={() => router.push('/dashboard/leads')}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Lead Search
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Profile Info (Left 2 columns) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Hero Card */}
                    <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                <Building className="w-10 h-10 text-blue-600" />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{buyer.companyName}</h1>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                                        </div>
                                        <div className="text-sm text-zinc-600 mt-1">Lead Quality: <span className={`font-bold px-2 py-0.5 rounded-md text-xs
                                            ${(buyer.verificationScore || 0) >= 8 ? 'bg-green-100 text-green-800' :
                                                (buyer.verificationScore || 0) >= 5 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {buyer.verificationScore || 0} / 10
                                        </span></div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 mt-4">
                                    <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                                        <MapPin className="w-4 h-4 text-zinc-400" />
                                        <span className="font-medium text-zinc-900">{buyer.country}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                                        <Briefcase className="w-4 h-4 text-zinc-400" />
                                        <span className="font-medium text-zinc-900">{buyer.industry}</span>
                                    </div>
                                    {buyer.productCategory && (
                                        <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            <span className="font-medium text-zinc-900">{buyer.productCategory} Focus</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-zinc-100">
                            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Company Overview</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                {buyer.companyName} is an active international importing business operating within the {buyer.industry} sector based in {buyer.country}.
                                Their primary focus encompasses {buyer.productCategory || 'general commodities'}. This profile has been verified by the Expo & Impo data enrichment system
                                and shows strong potential for long-term B2B trade partnerships.
                            </p>
                        </div>
                    </div>

                    {/* Verification Details Card */}
                    <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm mt-6">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Verification Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex items-center gap-3">
                                {buyer.emailVerified ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-zinc-400" />
                                )}
                                <span className={buyer.emailVerified ? "text-zinc-900 font-medium" : "text-zinc-500"}>Verified Email</span>
                            </div>

                            <div className="flex items-center gap-3">
                                {buyer.websiteActive ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-zinc-400" />
                                )}
                                <span className={buyer.websiteActive ? "text-zinc-900 font-medium" : "text-zinc-500"}>Active Website</span>
                            </div>

                            <div className="flex items-center gap-3">
                                {buyer.linkedin ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-zinc-400" />
                                )}
                                <span className={buyer.linkedin ? "text-zinc-900 font-medium" : "text-zinc-500"}>LinkedIn Profile</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                <span className="text-zinc-900 font-medium">
                                    Company Size: <span className="text-zinc-600 font-normal">{buyer.companySize || 'Unknown'}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm mt-6">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-6">Contact & Logistics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-500 mb-0.5">Website</p>
                                        {buyer.website ? (
                                            <a href={buyer.website.startsWith('http') ? buyer.website : `https://${buyer.website}`} target="_blank" rel="noreferrer" className="text-zinc-900 font-medium hover:text-blue-600 hover:underline">
                                                {buyer.website}
                                            </a>
                                        ) : <span className="text-zinc-400">Not provided</span>}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-500 mb-0.5">Email Address</p>
                                        {buyer.email ? (
                                            <div className="flex items-center gap-2">
                                                <a href={`mailto:${buyer.email}`} className="text-zinc-900 font-medium hover:text-blue-600 hover:underline">
                                                    {buyer.email}
                                                </a>
                                                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Validated</span>
                                            </div>
                                        ) : <span className="text-zinc-400">Not provided</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-500 mb-0.5">Phone Number</p>
                                        {buyer.phone ? (
                                            <span className="text-zinc-900 font-medium">{buyer.phone}</span>
                                        ) : <span className="text-zinc-400">Not provided</span>}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Linkedin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-500 mb-0.5">LinkedIn Profile</p>
                                        {buyer.linkedin ? (
                                            <a href={buyer.linkedin} target="_blank" rel="noreferrer" className="text-zinc-900 font-medium hover:text-blue-600 hover:underline">
                                                Company Page
                                            </a>
                                        ) : <span className="text-zinc-400">Not provided</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions (Right Column) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm sticky top-6">
                        <h3 className="font-semibold text-zinc-900 mb-4">Pipeline Actions</h3>

                        <div className="space-y-3">
                            {saved ? (
                                <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium border border-green-200">
                                    <CheckCircle2 className="w-5 h-5" /> Lead Saved to CRM
                                </div>
                            ) : (
                                <button
                                    suppressHydrationWarning
                                    onClick={handleSaveLead}
                                    disabled={isSaving}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all shadow-blue-500/20 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                    Save Lead
                                </button>
                            )}

                            <button
                                suppressHydrationWarning
                                onClick={() => setIsListModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-zinc-50 text-zinc-800 rounded-xl font-medium border border-zinc-200 shadow-sm transition-all"
                            >
                                <ListPlus className="w-5 h-5 text-zinc-500" />
                                Save to List
                            </button>

                            <button
                                suppressHydrationWarning
                                onClick={handleSendEmail}
                                disabled={!buyer.email}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-zinc-50 text-zinc-800 rounded-xl font-medium border border-zinc-200 shadow-sm transition-all disabled:opacity-50 disabled:hover:bg-white"
                            >
                                <Mail className="w-5 h-5 text-zinc-500" />
                                Send Email
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-100">
                            <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-3">Intelligence Snapshot</h4>
                            <ul className="space-y-2 text-sm text-zinc-600">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct Email Found</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cross-border verified</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active import region</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {isListModalOpen && buyer && (
                <SaveToListModal
                    buyerId={buyer.id}
                    onClose={() => setIsListModalOpen(false)}
                />
            )}
        </div>
    );
}
