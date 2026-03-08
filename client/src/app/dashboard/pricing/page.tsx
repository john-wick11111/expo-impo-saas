"use client";

import { useState } from "react";
import { Check, X, Loader2, Sparkles } from "lucide-react";

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string, planName: string) => {
        try {
            setIsLoading(planName);
            // Assuming dev server is running on localhost:5000
            const response = await fetch("http://localhost:5000/api/stripe/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });

            if (!response.ok) {
                throw new Error("Failed to create checkout session");
            }

            const data = await response.json();

            // Redirect to Stripe Checkout URL
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error initiating subscription:", error);
            alert("Payment system is currently unavailable. Please try again later.");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
                    Scale your international outreach
                </h1>
                <p className="text-xl text-zinc-600">
                    Choose the plan that fits your business needs. Upgrade anytime to unlock more lead searches and direct buyer outreach.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Starter Plan */}
                <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-zinc-900 mb-2">Starter</h2>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-zinc-900">$19</span>
                            <span className="text-zinc-500 font-medium">/month</span>
                        </div>
                        <p className="text-sm text-zinc-500 mt-4 h-10">Perfect for individuals starting their export journey.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span><strong className="font-semibold text-zinc-900">100</strong> buyer searches / mo</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span><strong className="font-semibold text-zinc-900">200</strong> saved leads</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span><strong className="font-semibold text-zinc-900">50</strong> emails / mo</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-400">
                            <X className="w-5 h-5 flex-shrink-0" />
                            <span>Advanced analytics</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => handleSubscribe("price_starter_mock_id", "starter")}
                        disabled={isLoading !== null}
                        className="w-full py-3 px-4 bg-white border-2 border-zinc-200 hover:border-zinc-300 text-zinc-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading === "starter" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Get Started"}
                    </button>
                </div>

                {/* Growth Plan */}
                <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-xl relative flex flex-col h-full transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-teal-950 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" /> Most Popular
                        </span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Growth</h2>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$49</span>
                            <span className="text-zinc-400 font-medium">/month</span>
                        </div>
                        <p className="text-sm text-zinc-400 mt-4 h-10">For growing teams that need a consistent flow of B2B leads.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-zinc-300">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span><strong className="font-semibold text-white">1,000</strong> buyer searches / mo</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span><strong className="font-semibold text-white">1,000</strong> saved leads</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span><strong className="font-semibold text-white">500</strong> emails / mo</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span>CRM Integrations</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => handleSubscribe("price_growth_mock_id", "growth")}
                        disabled={isLoading !== null}
                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                        {isLoading === "growth" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Subscribe to Growth"}
                    </button>
                </div>

                {/* Professional Plan */}
                <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-zinc-900 mb-2">Professional</h2>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-zinc-900">$99</span>
                            <span className="text-zinc-500 font-medium">/month</span>
                        </div>
                        <p className="text-sm text-zinc-500 mt-4 h-10">Maximum power for high-volume enterprise exporters.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span><strong className="font-semibold text-zinc-900">Unlimited</strong> buyer searches</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span><strong className="font-semibold text-zinc-900">Unlimited</strong> saved leads</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span><strong className="font-semibold text-zinc-900">Unlimited</strong> emails</span>
                        </li>
                        <li className="flex items-start gap-3 text-zinc-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Priority 24/7 Support</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => handleSubscribe("price_professional_mock_id", "professional")}
                        disabled={isLoading !== null}
                        className="w-full py-3 px-4 bg-white border-2 border-zinc-200 hover:border-zinc-300 text-zinc-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading === "professional" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Contact Sales"}
                    </button>
                </div>

            </div>
        </div>
    );
}
