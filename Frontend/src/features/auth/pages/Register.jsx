import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loading, handleRegister } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await handleRegister({ username, email, password });
            navigate("/", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <p className="form-error" role="alert">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" autoComplete="username" minLength={3} maxLength={40} required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter email" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
                    </div>
                    <button className="button primary-button" type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    );
};

export default Register;
