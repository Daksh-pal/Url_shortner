import { useState } from "react";
import type { FormEvent } from "react";
import { loginUser } from "../apis/user.api";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface LoginFormProps {
    onSwitchToRegister?: () => void;
    onClose?: () => void;
    onSubmit?: (data: { email: string; password: string }) => void;
}

export const LoginForm = ({ onSwitchToRegister, onClose, onSubmit }: LoginFormProps) => {
    const { setUser, closeAuthModal, setAuthMode,loading, setLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleSwitch = () => {
        if (onSwitchToRegister) {
            onSwitchToRegister();
        } else {
            setAuthMode("register");
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            closeAuthModal();
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await loginUser({ email: email.trim(), password });
            if (res.user) {
                setUser(res.user);
            }
            if (onSubmit) {
                onSubmit({ email: email.trim(), password });
            }
            handleClose();
        } catch (err: unknown) {
            console.error("Login failed:", err);
            if (axios.isAxiosError(err)) {
                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to sign in. Please check your credentials.";
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative">
            {/* Close Button */}
            <button
                onClick={handleClose}
                type="button"
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
                aria-label="Close modal"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium mb-1.5">
                    <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Welcome Back
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Sign in to <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 bg-clip-text text-transparent">ShortURL</span>
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                    Enter your credentials to access and manage your links
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-rose-400 hover:text-rose-200 cursor-pointer ml-2"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs sm:text-sm"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-300">
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-0 transition-all cursor-pointer"
                        />
                        <span className="text-xs text-slate-400">Remember me</span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 mt-1 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-4 pt-3.5 border-t border-slate-800 text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={handleSwitch}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline cursor-pointer"
                >
                    Create an account
                </button>
            </div>
        </div>
    );
};
