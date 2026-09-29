import { useState } from "react";
import {
    Navbar,
    Hero,
    UrlForm,
    ResultCard,
    Footer,
    BackgroundGlow,
    AuthModal,
    LoadingOverlay,
    UserLinksList,
} from "../components";
import type { ShortenedResult } from "../types/url.types";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState<"shorten" | "links">("shorten");
    const [currentResult, setCurrentResult] = useState<ShortenedResult | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUrlShortened = (result: ShortenedResult) => {
        setCurrentResult(result);
        setRefreshTrigger((prev) => prev + 1);
    };

    // Derive active view: if user is not logged in, always show shorten view
    const displayedView = user && activeView === "links" ? "links" : "shorten";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
            <BackgroundGlow />
            <Navbar activeView={displayedView} onNavigate={setActiveView} />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
                {displayedView === "shorten" ? (
                    <div className="w-full flex flex-col items-center animate-fadeIn">
                        <Hero />
                        <UrlForm onUrlShortened={handleUrlShortened} />
                        {currentResult && (
                            <ResultCard
                                result={currentResult}
                                onViewLinks={() => setActiveView("links")}
                                onDismiss={() => setCurrentResult(null)}
                            />
                        )}

                        {/* View All Links Button when user is logged in and no recent card is active */}
                        {user && !currentResult && (
                            <div className="mt-8 text-center animate-fadeIn">
                                <button
                                    onClick={() => setActiveView("links")}
                                    type="button"
                                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md dark:shadow-none transition-all cursor-pointer group"
                                >
                                    <div className="w-5 h-5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <span>View & Manage All My Links</span>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full animate-fadeIn">
                        {/* Dedicated My Links Page Navigation Header */}
                        <div className="mb-6 flex items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setActiveView("shorten")}
                                type="button"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group"
                            >
                                <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 transition-colors">
                                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </span>
                                <span>Back to Shortener</span>
                            </button>

                            <button
                                onClick={() => setActiveView("shorten")}
                                type="button"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Shorten New URL</span>
                            </button>
                        </div>

                        <UserLinksList
                            refreshTrigger={refreshTrigger}
                            onGoToShorten={() => setActiveView("shorten")}
                        />
                    </div>
                )}
            </main>

            <Footer />

            <AuthModal />
            <LoadingOverlay />
        </div>
    );
};