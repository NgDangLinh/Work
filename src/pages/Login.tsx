import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../api/auth";
import { authStorage } from "../api/authStorage";
import { getMe } from "../api/user";
import { useNavigate } from "react-router-dom";

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
        <div>
            <h1>Đăng nhập</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Tài khoản</label>

                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Nhập tài khoản"
                    />
                </div>

                <div>
                    <label htmlFor="password">Mật khẩu</label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
}

export default Login;