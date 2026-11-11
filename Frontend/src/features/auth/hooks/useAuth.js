import { useContext } from "react";
import { AuthContext } from "../auth.context.js";
import { login, register, logout } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider.");
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!window.confirm("Are you sure you want to logout?")) return false;
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return true;
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, handleRegister, handleLogin, handleLogout };
};
