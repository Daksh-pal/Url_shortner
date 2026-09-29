import { useState } from "react";
import type { ShortenedResult } from "../types/url.types";

interface ResultCardProps {
    result: ShortenedResult;
    onViewLinks?: () => void;
    onDismiss?: () => void;
}

export const ResultCard = ({ result, onViewLinks, onDismiss }: ResultCardProps) => {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Split base and slug for sophisticated typography display
    const slug = result.shortId || "";
    const baseUrl = result.shortUrl.endsWith(slug)
        ? result.shortUrl.slice(0, -slug.length)
        : result.shortUrl;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
        result.shortUrl
    )}&margin=10`;

    return (
        <div className="w-full mt-6 relative overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-950/40 p-5 sm:p-6 transition-all duration-200 animate-fadeIn">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

            {/* Header: Status pill + Timestamp + Dismiss */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        Link Ready
                    </span>
                    <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        • Fast 302 Redirection
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {result.createdAt || "Just now"}
                    </span>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            type="button"
                            aria-label="Dismiss card"
                            title="Dismiss"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Showcase Box: The Shortened URL */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1 font-mono tracking-tight select-all">
                        <a
                            href={result.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-baseline flex-wrap text-sm sm:text-base font-semibold group/link hover:opacity-90 transition-opacity"
                        >
                            <span className="text-slate-500 dark:text-slate-400 font-normal">
                                {baseUrl}
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-4 decoration-indigo-300 dark:decoration-indigo-700">
                                {slug}
                            </span>
                        </a>
                    </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Open in new tab icon button */}
                    <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open link in new tab"
                        className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">Visit</span>
                    </a>

                    {/* Copy Link Button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95 shadow-md ${
                            copied
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/40"
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 text-emerald-200 animate-scaleCheck" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
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

            {/* Destination URL row */}
            <div className="mt-3 px-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <svg className="w-3.5 h-3.5 shrink-0 text-slate-400 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="shrink-0 font-medium text-slate-400 dark:text-slate-500">Destination:</span>
                <span className="truncate text-slate-600 dark:text-slate-300 font-mono text-[11px] sm:text-xs select-all" title={result.originalUrl}>
                    {result.originalUrl}
                </span>
            </div>

            {/* Footer Utility Bar */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                {/* QR Code toggle */}
                <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span>{showQR ? "Hide QR Code" : "Show QR Code"}</span>
                </button>

                {/* View in My Links navigation */}
                {onViewLinks && (
                    <button
                        type="button"
                        onClick={onViewLinks}
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer group"
                    >
                        <span>Manage in My Links</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* QR Code Expansion Panel */}
            {showQR && (
                <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                        <img
                            src={qrUrl}
                            alt="QR Code"
                            className="w-32 h-32 rounded-sm"
                            loading="lazy"
                        />
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Scan to visit shortened link
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px]">
                            Use any mobile camera or scanner to quickly test this redirection.
                        </p>
                        <a
                            href={qrUrl}
                            download={`qrcode-${slug}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download PNG</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
