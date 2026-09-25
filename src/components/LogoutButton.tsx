import { useNavigate } from "react-router-dom";
import { authStorage } from "../api/authStorage";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        authStorage.clearTokens();

        navigate("/login", { replace: true });
    };

    return (
        <button
            className="logout-button"
            onClick={handleLogout}
        >
            Đăng xuất
        </button>
    );
}

export default LogoutButton;