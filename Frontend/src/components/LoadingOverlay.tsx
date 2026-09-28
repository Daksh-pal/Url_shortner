import { useAuth } from "../context/AuthContext";

interface LoadingOverlayProps {
    message?: string;
    subtext?: string;
}

export const LoadingOverlay = ({
    message = "Processing",
    subtext = "Please wait a moment...",
}: LoadingOverlayProps) => {
    const { loading } = useAuth();

    // Only render when actively loading
    if (!loading) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 dark:bg-slate-950/75 backdrop-blur-md transition-all duration-300 animate-fadeIn"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="relative flex flex-col items-center px-8 py-7 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl max-w-xs mx-4 text-center">
                {/* Ambient glow matching Hero & theme */}
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-tr from-indigo-500 via-sky-500 to-teal-400 opacity-20 blur-xl pointer-events-none" />

                {/* Animated Concentric Orbital Spinner */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Soft ambient radial blur behind the spinner */}
                    <div className="absolute inset-1 rounded-full bg-linear-to-tr from-indigo-500 to-cyan-400 opacity-25 blur-md animate-pulse" />

                    {/* Outer muted track */}
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200/60 dark:border-slate-800/80" />

                    {/* Primary spinning arc */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 dark:border-t-indigo-400 border-r-indigo-500/40 animate-spin [animation-duration:1s]" />

                    {/* Inner counter-rotating arc */}
                    <div className="absolute inset-2.5 rounded-full border-2 border-transparent border-b-cyan-500 dark:border-b-cyan-400 border-l-teal-400/40 animate-spin [animation-duration:1.4s] [animation-direction:reverse]" />

                    {/* Perfectly centered radiant core */}
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-linear-to-tr from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] animate-pulse" />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                    {message}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {subtext}
                </p>
            </div>
        </div>
    );
};
