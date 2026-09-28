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
} from "../components";
import type { ShortenedResult } from "../types/url.types";

export const Home = () => {
    const [currentResult, setCurrentResult] = useState<ShortenedResult | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
            <BackgroundGlow />
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col items-center">
                <Hero />
                <UrlForm onUrlShortened={(result) => setCurrentResult(result)} />
                {currentResult && <ResultCard result={currentResult} />}
            </main>

            <Footer />

            <AuthModal />
            <LoadingOverlay />
        </div>
    );
};