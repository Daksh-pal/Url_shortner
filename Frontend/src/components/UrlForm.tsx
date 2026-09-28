import { useState } from "react";
import type { FormEvent } from "react";
import { createShortUrl } from "../apis/shortUrl.api";
import { useAuth } from "../context/AuthContext";
import type { ShortenedResult } from "../types/url.types";
import { API_BASE_URL } from "../apis/client";
import axios from "axios";



interface UrlFormProps {
    onUrlShortened?: (result: ShortenedResult) => void;
}

export const UrlForm = ({ onUrlShortened }: UrlFormProps) => {
    const { user, openlogin, loading, setLoading } = useAuth();
    const [originalUrl, setOriginalUrl] = useState("");
    const [slug, setSlug] = useState("");
    const [showCustomSlug, setShowCustomSlug] = useState(false);
    const [error, setError] = useState("");

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleShorten = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        let formattedUrl = originalUrl.trim();
        if (!formattedUrl) {
            setError("Please enter a URL to shorten");
            return;
        }

        // Auto-add protocol if omitted
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = "https://" + formattedUrl;
        }

        if (!validateUrl(formattedUrl)) {
            setError("Please enter a valid URL (e.g. https://example.com)");
            return;
        }

        // If not logged in, prompt user to sign in
        if (!user) {
            setError("Please sign in or create an account to shorten links.");
            openlogin();
            return;
        }

        setLoading(true);

        try {
            const data = await createShortUrl(formattedUrl, slug.trim() || undefined);
            const rec = data.newRec;
            const fullShortUrl = `${API_BASE_URL}/r/${rec.shortId}`;

            if (onUrlShortened) {
                onUrlShortened({
                    shortUrl: fullShortUrl,
                    shortId: rec.shortId,
                    originalUrl: rec.originalUrl,
                    createdAt: rec.createdAt
                        ? new Date(rec.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "Just now",
                    clicks: rec.clicks || 0,
                });
            }

            setOriginalUrl("");
            setSlug("");
            setShowCustomSlug(false);
        } catch (err: unknown) {
            console.error("Failed to shorten URL:", err);

            if (axios.isAxiosError(err)) {

                if (err.response?.status === 401) {
                    setError("Your session has expired. Please sign in again.");
                    openlogin();
                    return;
                }

                setError(
                    err.response?.data?.message ??
                    err.message ??
                    "Failed to shorten URL. Please try again."
                );

            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-2xl backdrop-blur-xl relative group transition-colors duration-200">
            <form onSubmit={handleShorten} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Main URL Input */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Paste your long link here (e.g. https://github.com/...)"
                            value={originalUrl}
                            onChange={(e) => {
                                setOriginalUrl(e.target.value);
                                if (error) setError("");
                            }}
                            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                        />
                        {originalUrl && (
                            <button
                                type="button"
                                onClick={() => setOriginalUrl("")}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                aria-label="Clear input"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !originalUrl.trim()}
                        className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 min-w-[150px] active:scale-[0.98] cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Shortening...</span>
                            </>
                        ) : (
                            <>
                                <span>Shorten URL</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>

                {/* Optional Custom Slug Toggle */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <button
                        type="button"
                        onClick={() => setShowCustomSlug(!showCustomSlug)}
                        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {showCustomSlug ? "Hide custom alias" : "Add custom alias (optional)"}
                    </button>
                    {!user && (
                        <span className="text-amber-500 dark:text-amber-400/90 text-xs">
                            Sign in required to shorten
                        </span>
                    )}
                </div>

                {/* Custom Slug Input */}
                {showCustomSlug && (
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
                            {API_BASE_URL}/r/
                        </div>
                        <input
                            type="text"
                            placeholder="my-custom-slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                            className="w-full pl-36 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                        />
                    </div>
                )}
            </form>

            {/* Error Banner */}
            {error && (
                <div className="mt-3.5 px-3.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </span>
                    <button
                        onClick={() => setError("")}
                        className="text-amber-500 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-200 cursor-pointer ml-2"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};