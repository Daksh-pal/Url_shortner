import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { UserLink } from "../types/url.types";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    link: UserLink | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal = ({
    isOpen,
    link,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteConfirmModalProps) => {
    // Listen for Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isDeleting) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isDeleting, onClose]);

    // Lock background body scroll when modal is open
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen || !link) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            {/* Backdrop click to dismiss */}
            <div
                className="fixed inset-0 cursor-pointer"
                onClick={!isDeleting ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Dialog Box */}
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-200">
                {/* Warning Icon & Header */}
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3
                            id="delete-modal-title"
                            className="text-lg font-bold text-slate-900 dark:text-white tracking-tight"
                        >
                            Delete Short Link?
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Are you sure you want to delete this link? Anyone visiting this short URL will no longer be redirected. This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Link Preview Details */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Short Code:</span>
                        <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                            /{link.shortId}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-slate-600 dark:text-slate-400 shrink-0">Target:</span>
                        <span className="truncate text-slate-700 dark:text-slate-300 font-mono text-[11px] text-right">
                            {link.originalUrl}
                        </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                        <span className="text-slate-500">Total Clicks:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {link.clicks.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 shadow-md shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete Link</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
