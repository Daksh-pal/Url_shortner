export const Hero = () => {
    return (
        <div className="text-center max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium mb-4">
                <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Streamlined URL Shortening Solution
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
                Shorten links, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400 dark:from-indigo-400 dark:via-sky-400 dark:to-teal-300 bg-clip-text text-transparent">
                    amplify your reach.
                </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                Transform lengthy, complex web addresses into clean, memorable, and shareable short links in one click.
            </p>
        </div>
    );
};
