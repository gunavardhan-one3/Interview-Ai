import axios from "axios";

const api = axios.create({ baseURL: "/api/auth", withCredentials: true });

export async function register({ username, email, password }) {
    const response = await api.post("/register", { username, email, password });
    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post("/login", { email, password });
    return response.data;
}

export async function logout() {
    const response = await api.post("/logout");
    return response.data;
}

export async function getMe() {
    try {
        const response = await api.get("/get-me");
        return response.data;
    } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 404) return null;
        throw error;
    }
}
