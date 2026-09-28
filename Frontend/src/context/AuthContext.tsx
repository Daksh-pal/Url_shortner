import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { logoutUser } from "../apis/user.api";
import { apiClient } from "../apis/client";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

    isAuthModelOpen: boolean;

    authmode: "login" | "register";
    setAuthMode: React.Dispatch<React.SetStateAction<"login" | "register">>;

    openlogin: () => void;
    openRegister: () => void;
    closeAuthModal: () => void;
    logout: () => Promise<void>;
    loading : boolean;
    setLoading : React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading , setLoading] = useState(false);
    const [isAuthModelOpen, setIsAuthModalOpen] = useState(false);
    const [authmode, setAuthMode] = useState<"login" | "register">("login");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get("/api/auth/me");
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // useEffect(() => {
    //     if (user) {
    //         localStorage.setItem("user", JSON.stringify(user));
    //     } else {
    //         localStorage.removeItem("user");
    //     }
    // }, [user]);

    const openlogin = () => {
        setAuthMode("login");
        setIsAuthModalOpen(true);
    };

    const openRegister = () => {
        setAuthMode("register");
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const logout = async () => {
        try {
            setLoading(true);
            await logoutUser();
        } catch (error) {
            console.log("Failed to logout:", error);
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        setUser,
        isAuthModelOpen,
        authmode,
        setAuthMode,
        openlogin,
        openRegister,
        closeAuthModal,
        logout,
        loading ,
        setLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};