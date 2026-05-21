"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Dummy login redirect for MVP
        window.location.href = "/dashboard";
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-zinc-100">
                <div>
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to home
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Or{" "}
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            start your 14-day free trial
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-zinc-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl text-black font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl text-black font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md hover:shadow-lg"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
