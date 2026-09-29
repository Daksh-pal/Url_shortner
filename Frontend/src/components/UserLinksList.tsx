import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserLinks, deleteUserLink } from "../apis/shortUrl.api";
import { API_BASE_URL } from "../apis/client";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { UserLink } from "../types/url.types";
import axios from "axios";

interface UserLinksListProps {
    refreshTrigger?: number;
    onLinkDeleted?: (id: number) => void;
    onGoToShorten?: () => void;
}

export const UserLinksList = ({
    refreshTrigger = 0,
    onLinkDeleted,
    onGoToShorten,
}: UserLinksListProps) => {
    const { user } = useAuth();
    const [links, setLinks] = useState<UserLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Delete Modal State
    const [linkToDelete, setLinkToDelete] = useState<UserLink | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Copy Feedback State
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Search query state
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLinks = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);

        try {
            const data = await getUserLinks();
            setLinks(data.links || []);
        } catch (err: unknown) {
            console.error("Failed to load user links:", err);
            if (axios.isAxiosError(err) && err.response?.status !== 401) {
                setError(err.response?.data?.message || "Failed to load your links.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        getUserLinks()
            .then((data) => {
                if (isMounted) {
                    setLinks(data.links || []);
                    setIsLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (!isMounted) return;
                console.error("Failed to load user links:", err);
                if (axios.isAxiosError(err) && err.response?.status !== 401) {
                    setError(err.response?.data?.message || "Failed to load your links.");
                }
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [user, refreshTrigger]);

    const handleCopy = async (id: number, shortId: string) => {
        const fullShortUrl = `${API_BASE_URL}/r/${shortId}`;
        try {
            await navigator.clipboard.writeText(fullShortUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleDeleteClick = (link: UserLink) => {
        setLinkToDelete(link);
    };

    const handleDeleteConfirm = async () => {
        if (!linkToDelete) return;

        setIsDeleting(true);
        try {
            await deleteUserLink(linkToDelete.id);
            setLinks((prev) => prev.filter((item) => item.id !== linkToDelete.id));
            if (onLinkDeleted) {
                onLinkDeleted(linkToDelete.id);
            }
            setLinkToDelete(null);
        } catch (err: unknown) {
            console.error("Failed to delete link:", err);
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || "Failed to delete link. Please try again.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    // If not logged in, don't show the dashboard
    if (!user) {
        return null;
    }

    const filteredLinks = links.filter(
        (link) =>
            link.shortId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="w-full mt-2 animate-fadeIn" aria-label="My Shortened Links">
            {/* Header with Title, Stats, and Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            My Links
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage and track your shortened URLs
                        </p>
                    </div>
                    <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {links.length}
                    </span>
                </div>

                {/* Actions: Search & Refresh */}
                <div className="flex items-center gap-2">
                    {links.length > 2 && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search links..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-36 sm:w-48 transition-all"
                            />
                            <svg
                                className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={fetchLinks}
                        disabled={isLoading}
                        title="Refresh links"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                        aria-label="Refresh link list"
                    >
                        <svg
                            className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={fetchLinks}
                        className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 ml-2 cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && links.length === 0 && (
                <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col sm:flex-row justify-between gap-4"
                        >
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                            </div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24 shrink-0" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && links.length === 0 && (
                <div className="mt-6 text-center py-12 px-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        No links created yet
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Paste a long web address in the shortener to create and track your first link.
                    </p>
                    {onGoToShorten && (
                        <button
                            type="button"
                            onClick={onGoToShorten}
                            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Shorten Your First Link</span>
                        </button>
                    )}
                </div>
            )}

            {/* Links List */}
            {!isLoading && links.length > 0 && filteredLinks.length === 0 && (
                <div className="mt-6 text-center py-8 text-xs text-slate-500 dark:text-slate-400">
                    No links found matching <span className="font-semibold text-slate-700 dark:text-slate-200">"{searchQuery}"</span>
                </div>
            )}

            <div className="mt-4 space-y-3">
                {filteredLinks.map((link) => {
                    const fullShortUrl = `${API_BASE_URL}/r/${link.shortId}`;
                    const formattedDate = new Date(link.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    });

                    return (
                        <div
                            key={link.id}
                            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md dark:shadow-none transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            {/* Left: Link Details */}
                            <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <a
                                        href={fullShortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-base sm:text-lg font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-mono tracking-tight hover:underline flex items-center gap-1.5"
                                    >
                                        <span>/{link.shortId}</span>
                                        <svg
                                            className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>

                                    {/* Clicks Pill */}
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <span>{link.clicks.toLocaleString()} clicks</span>
                                    </span>
                                </div>

                                {/* Destination URL */}
                                <p
                                    title={link.originalUrl}
                                    className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-lg font-mono"
                                >
                                    {link.originalUrl}
                                </p>

                                {/* Date */}
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                    Created {formattedDate}
                                </p>
                            </div>

                            {/* Right: Actions (Copy & Delete) */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {/* Copy Button */}
                                <button
                                    type="button"
                                    onClick={() => handleCopy(link.id, link.shortId)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        copiedId === link.id
                                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                                            : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60"
                                    }`}
                                >
                                    {copiedId === link.id ? (
                                        <>
                                            <svg
                                                className="w-3.5 h-3.5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2.5"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                                />
                                            </svg>
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteClick(link)}
                                    title="Delete link"
                                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
                                    aria-label={`Delete link ${link.shortId}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={!!linkToDelete}
                link={linkToDelete}
                isDeleting={isDeleting}
                onClose={() => setLinkToDelete(null)}
                onConfirm={handleDeleteConfirm}
            />
        </section>
    );
};
