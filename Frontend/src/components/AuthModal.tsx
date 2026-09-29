import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "../context/AuthContext";

export const AuthModal = () => {
    const { isAuthModelOpen, closeAuthModal, authmode, setAuthMode } = useAuth();

    if (!isAuthModelOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            {/* Backdrop click to dismiss */}
            <div
                className="fixed inset-0 cursor-pointer"
                onClick={closeAuthModal}
                aria-hidden="true"
            />

            {/* Modal Box */}
            <div className="relative z-10 w-full max-w-md my-auto max-h-[90vh] overflow-y-auto">
                {/* Tab Switcher */}
                <div className="flex items-center p-1 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl mb-3 shadow-md backdrop-blur-sm transition-colors duration-200">
                    <button
                        type="button"
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            authmode === "login"
                                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setAuthMode("register")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            authmode === "register"
                                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                {/* Form Content */}
                {authmode === "login" ? (
                    <LoginForm
                        onSwitchToRegister={() => setAuthMode("register")}
                        onClose={closeAuthModal}
                    />
                ) : (
                    <RegisterForm
                        onSwitchToLogin={() => setAuthMode("login")}
                        onClose={closeAuthModal}
                    />
                )}
            </div>
        </div>
    );
};

