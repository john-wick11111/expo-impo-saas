import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans text-zinc-900 selection:bg-blue-200">
      <main className="flex flex-col items-center text-center max-w-4xl px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Expo&Impo
          </h1>
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          The Ultimate B2B Lead Gen Engine for Exporters
        </h2>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed">
          Discover international buyers, manage CRM pipelines, and automate your export outreach all in one modern platform.
        </p>

        <div className="flex gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-white font-medium shadow-md transition-transform hover:scale-105 hover:bg-blue-700"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-zinc-900 font-medium border border-zinc-200 shadow-sm transition-transform hover:bg-zinc-50 hover:scale-105"
          >
            Log in
          </Link>
        </div>
      </main>

      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
    </div>
  );
}
