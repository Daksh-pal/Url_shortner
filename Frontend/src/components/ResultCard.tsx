import { useState } from "react";
import type { ShortenedResult } from "../types/url.types";

interface ResultCardProps {
    result: ShortenedResult;
}

export const ResultCard = ({ result }: ResultCardProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="w-full mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-2xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-indigo-950/40 transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Your Link is Ready</span>
                </div>
                <span className="text-xs text-slate-500">Created {result.createdAt}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate flex items-center gap-1">
                        <span className="font-medium text-slate-500">Destination:</span>
                        <span className="truncate">{result.originalUrl}</span>
                    </p>
                    <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-lg sm:text-xl font-bold tracking-tight block truncate transition-colors"
                    >
                        {result.shortUrl}
                    </a>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:from-indigo-500 hover:to-blue-500 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Link</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
