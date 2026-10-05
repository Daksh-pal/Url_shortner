import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserLinks, deleteUserLink } from "../apis/shortUrl.api";
import { API_BASE_URL } from "../apis/client";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { UserLink, PaginationInfo } from "../types/url.types";
import { getFaviconUrl, getDomain } from "../utils/url.utils";
import axios from "axios";

interface UserLinksListProps {
    refreshTrigger?: number;
    onLinkDeleted?: (id: number) => void;
    onGoToShorten?: () => void;
}

interface LinkCardProps {
    link: UserLink;
    onDelete: (link: UserLink) => void;
}

const LinkCard = ({ link, onDelete }: LinkCardProps) => {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [faviconError, setFaviconError] = useState(false);

    const fullShortUrl = `${API_BASE_URL}/r/${link.shortId}`;
    const targetDomain = getDomain(link.originalUrl);
    const faviconUrl = getFaviconUrl(link.originalUrl);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
        fullShortUrl
    )}&margin=10`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullShortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const formattedDate = new Date(link.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-500/60 p-4 transition-all duration-200 shadow-xs hover:shadow-md dark:shadow-none">
            {/* Main Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                {/* Left: Favicon + Short Link + Target Destination */}
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
                        <div className="flex items-center gap-2 flex-wrap">
                            <a
                                href={fullShortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-baseline font-mono text-sm sm:text-base tracking-tight hover:underline group"
                            >
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-0.5">
                                    {API_BASE_URL}/r/{link.shortId}
                                </span>
                            </a>

                            {/* Clicks Counter Pill */}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
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

                        {/* Destination Subtitle & Created Date */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                            <span className="text-slate-400 dark:text-slate-500 shrink-0">↳</span>
                            <span
                                className="truncate font-mono text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 max-w-xs sm:max-w-md"
                                title={link.originalUrl}
                            >
                                {link.originalUrl}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions (Copy, QR, Visit, Delete) */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Copy Link Button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
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
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visit link"
                        aria-label="Visit link"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>

                    {/* Delete Button */}
                    <button
                        type="button"
                        onClick={() => onDelete(link)}
                        title="Delete link"
                        aria-label={`Delete link ${link.shortId}`}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
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

            {/* Expandable QR Code Drawer */}
            {showQR && (
                <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3.5">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                className="w-20 h-20 rounded"
                                loading="lazy"
                            />
                        </div>
                        <div className="space-y-1 text-left">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                QR Code for /{link.shortId}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px]">
                                Point any mobile camera to test this redirect.
                            </p>
                            <a
                                href={qrUrl}
                                download={`qrcode-${link.shortId}.png`}
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
                </div>
            )}
        </div>
    );
};

export const UserLinksList = ({
    refreshTrigger = 0,
    onLinkDeleted,
    onGoToShorten,
}: UserLinksListProps) => {
    const { user } = useAuth();
    const [links, setLinks] = useState<UserLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);

    // Delete Modal State
    const [linkToDelete, setLinkToDelete] = useState<UserLink | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search query state
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLinks = useCallback(async (targetPage?: number) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);

        const pageToFetch = typeof targetPage === "number" ? targetPage : page;
        try {
            const data = await getUserLinks(pageToFetch, 10);
            setLinks(data.links || []);
            setPagination(data.pagination || null);
        } catch (err: unknown) {
            console.error("Failed to load user links:", err);
            if (axios.isAxiosError(err) && err.response?.status !== 401) {
                setError(err.response?.data?.message || "Failed to load your links.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [user, page]);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        getUserLinks(page, 10)
            .then((data) => {
                if (isMounted) {
                    setLinks(data.links || []);
                    setPagination(data.pagination || null);
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
    }, [user, page, refreshTrigger]);

    const handleDeleteClick = (link: UserLink) => {
        setLinkToDelete(link);
    };

    const handleDeleteConfirm = async () => {
        if (!linkToDelete) return;

        setIsDeleting(true);
        try {
            await deleteUserLink(linkToDelete.id);
            if (onLinkDeleted) {
                onLinkDeleted(linkToDelete.id);
            }
            setLinkToDelete(null);

            // If we deleted the only item on the current page and page > 1, go back one page
            if (links.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
            } else {
                fetchLinks(page);
            }
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
                    </div>
                    <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {pagination ? pagination.total : links.length}
                    </span>
                </div>

                {/* Actions: Search & Refresh */}
                <div className="flex items-center gap-2">
                    {links.length > 1 && (
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
                        onClick={() => fetchLinks()}
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
                        onClick={() => fetchLinks()}
                        className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 ml-2 cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && links.length === 0 && (
                <div className="mt-4 space-y-2.5">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col sm:flex-row justify-between gap-3"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                                </div>
                            </div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24 shrink-0 self-end sm:self-center" />
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

            <div className="mt-4 max-h-[560px] overflow-y-auto p-0.5 pr-2 space-y-2.5 custom-scrollbar">
                {filteredLinks.map((link) => (
                    <LinkCard
                        key={link.id}
                        link={link}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {!isLoading && pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                        Showing{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {(pagination.page - 1) * pagination.limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {pagination.total}
                        </span>{" "}
                        links
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={!pagination.hasPrevPage || isLoading}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>

                        <span className="px-2 font-medium text-slate-600 dark:text-slate-400">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                            disabled={!pagination.hasNextPage || isLoading}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <span>Next</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

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
