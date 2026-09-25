import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../api/auth";
import { authStorage } from "../api/authStorage";
import { getMe } from "../api/user";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login({
                username,
                password,
                type: 0,
            });

            if (response.errorCode !== 0) {
                setError(response.message ?? "Đăng nhập thất bại");
                return;
            }

            const { accessToken, refreshToken } = response.data;

            authStorage.setTokens(
                accessToken.value,
                refreshToken.value
            );

            const me = await getMe();

            console.log("Current user:", me);

            navigate("/investors");

            console.log("Login successful");

            console.log("Login response:", response);
        } catch (error) {
            console.error("Login error:", error);
            setError("Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">
                        Đăng nhập
                    </h1>

                    <p className="login-description">
                        Đăng nhập vào hệ thống quản lý
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="login-field">
                        <label className="login-label">
                            Tài khoản
                        </label>

                        <input
                            className="login-input"
                            type="text"
                            placeholder="Nhập tài khoản"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">
                            Mật khẩu
                        </label>

                        <input
                            className="login-input"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang đăng nhập..."
                            : "Đăng nhập"}
                    </button>
                </form>

                <div className="login-footer">
                    Investor Management System
                </div>
            </div>
        </div>
    );
}

export default Login;