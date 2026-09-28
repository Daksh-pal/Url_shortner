import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const Navbar = () => {
    const { user, openlogin, openRegister, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-40 bg-white/80 dark:bg-slate-950/70 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                            ShortURL
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Status Badge (hidden on smallest screens) */}
                    <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-500 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Fast Redirection</span>
                    </div>

                    {user ? (
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                                    {user.name ? user.name[0].toUpperCase() : "U"}
                                </div>
                                <span className="text-slate-700 dark:text-slate-200 font-medium max-w-[120px] truncate">
                                    {user.name || user.email}
                                </span>
                            </div>

                            {/* Theme switch button between loggedin user and logout button */}
                            <button
                                onClick={toggleTheme}
                                type="button"
                                aria-label="Toggle theme"
                                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center"
                            >
                                {theme === "dark" ? (
                                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {logout && (
                                <button
                                    onClick={logout}
                                    type="button"
                                    className="text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                                >
                                    Log out
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                type="button"
                                aria-label="Toggle theme"
                                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center mr-1"
                            >
                                {theme === "dark" ? (
                                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={openlogin}
                                type="button"
                                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/80 cursor-pointer"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={openRegister}
                                type="button"
                                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-lg shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};