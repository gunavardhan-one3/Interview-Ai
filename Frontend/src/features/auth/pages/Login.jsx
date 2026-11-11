import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await handleLogin({ email, password });
            navigate("/", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                {error && <p className="form-error" role="alert">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter email" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
                    </div>
                    <button className="button primary-button" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
                <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    );
};

export default Login;
