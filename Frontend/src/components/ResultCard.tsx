import { useState } from "react";
import type { ShortenedResult } from "../types/url.types";
import { getFaviconUrl, getDomain } from "../utils/url.utils";

interface ResultCardProps {
    result: ShortenedResult;
    onViewLinks?: () => void;
    onDismiss?: () => void;
}

export const ResultCard = ({ result, onViewLinks, onDismiss }: ResultCardProps) => {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [faviconError, setFaviconError] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const slug = result.shortId || "";
    const baseUrl = result.shortUrl.endsWith(slug)
        ? result.shortUrl.slice(0, -slug.length)
        : result.shortUrl;

    const targetDomain = getDomain(result.originalUrl);
    const faviconUrl = getFaviconUrl(result.originalUrl);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
        result.shortUrl
    )}&margin=10`;

    return (
        <div className="w-full mt-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-indigo-500/5 dark:shadow-indigo-950/20 p-4 sm:p-5 transition-all duration-200 animate-fadeIn">
            {/* Main Interactive Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Favicon + Short Link + Destination */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Destination Favicon / Icon Badge */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        {!faviconError && faviconUrl ? (
                            <img
                                src={faviconUrl}
                                alt={targetDomain}
                                className="w-5 h-5 object-contain"
                                onError={() => setFaviconError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                        )}
                    </div>

                    {/* URL Details */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                        <a
                            href={result.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-baseline flex-wrap font-mono text-sm sm:text-base tracking-tight hover:underline group"
                        >
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-0.5">
                                {baseUrl}{slug}
                            </span>
                        </a>

                        {/* Destination Subtitle */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                            <span className="text-slate-400 dark:text-slate-500 shrink-0">↳</span>
                            <span className="truncate font-mono text-[11px] sm:text-xs text-slate-600 dark:text-slate-400" title={result.originalUrl}>
                                {result.originalUrl}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions (Copy, Visit, QR, Dismiss) */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Copy Link Button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                            copied
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25"
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy</span>
                            </>
                        )}
                    </button>

                    {/* QR Code Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setShowQR(!showQR)}
                        title={showQR ? "Hide QR Code" : "Show QR Code"}
                        aria-label="Toggle QR Code"
                        className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                            showQR
                                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                                : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/80"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </button>

                    {/* Visit Link Button */}
                    <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visit short URL"
                        aria-label="Visit link"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>

                    {/* Dismiss Button */}
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            type="button"
                            title="Dismiss"
                            aria-label="Dismiss card"
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Expandable QR Code Drawer */}
            {showQR && (
                <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3.5">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                className="w-24 h-24 rounded"
                                loading="lazy"
                            />
                        </div>
                        <div className="space-y-1 text-left">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                QR Code Ready
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px]">
                                Point any mobile camera to test this redirect.
                            </p>
                            <a
                                href={qrUrl}
                                download={`qrcode-${slug}.png`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download PNG</span>
                            </a>
                        </div>
                    </div>

                    {onViewLinks && (
                        <button
                            type="button"
                            onClick={onViewLinks}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                            <span>Manage in My Links</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
