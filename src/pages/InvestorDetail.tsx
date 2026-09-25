import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getInvestorDetail,
    updateInvestor,
    type Investor,
    type UpdateInvestorData,
} from "../api/investors";
import LogoutButton from "../components/LogoutButton";
import "./InvestorDetail.css";

function InvestorDetail() {
    const { investorCode } = useParams();
    const navigate = useNavigate();

    const [investor, setInvestor] =
        useState<Investor | null>(null);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] =
        useState<UpdateInvestorData>({});

    useEffect(() => {
        if (!investorCode) return;

        const fetchInvestorDetail = async () => {
            try {
                setLoading(true);

                const response =
                    await getInvestorDetail(investorCode);

                console.log(
                    "Investor detail:",
                    response
                );

                setInvestor(response.data);
            } catch (error) {
                console.error(
                    "Get investor detail failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInvestorDetail();
    }, [investorCode]);

    const handleEdit = () => {
        if (!investor) return;

        setFormData({
            investorName: investor.investorName,
            dateOfBirth: investor.dateOfBirth,
            gender: investor.gender,
            nationality: investor.nationality,
            phoneNumber: investor.phoneNumber,
            email: investor.email,
            permanentAddress:
                investor.permanentAddress,
        });

        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData({});
    };

    const handleChange = (
        field: keyof UpdateInvestorData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!investorCode) return;

        try {
            setSaving(true);

            const response = await updateInvestor(
                investorCode,
                formData
            );

            console.log(
                "Update investor:",
                response
            );

            const updatedInvestor =
                await getInvestorDetail(
                    investorCode
                );

            setInvestor(updatedInvestor.data);

            setEditing(false);
            setFormData({});

            alert("Cập nhật thành công");
        } catch (error) {
            console.error(
                "Update investor failed:",
                error
            );

            alert("Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (value: string) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("vi-VN");
    };

    const getGenderText = (value: string) => {
        switch (value) {
            case "MALE":
                return "Nam";

            case "FEMALE":
                return "Nữ";

            default:
                return value;
        }
    };

    const getInvestorTypeText = (value: string) => {
        switch (value) {
            case "INDIVIDUAL":
                return "Cá nhân";

            case "CORPORATE":
                return "Doanh nghiệp";

            default:
                return value;
        }
    };

    const getStatusText = (value: string) => {
        switch (value) {
            case "APPROVED":
                return "Đã duyệt";

            case "PENDING":
                return "Chờ duyệt";

            case "REJECTED":
                return "Từ chối";

            default:
                return value;
        }
    };

    const getStatusClass = (value: string) => {
        switch (value) {
            case "APPROVED":
                return "approved";

            case "PENDING":
                return "pending";

            case "REJECTED":
                return "rejected";

            default:
                return "";
        }
    };

    if (loading) {
        return (
            <div className="detail-state">
                Đang tải thông tin nhà đầu tư...
            </div>
        );
    }

    if (!investor) {
        return (
            <div className="detail-state">
                Không tìm thấy nhà đầu tư
            </div>
        );
    }

    return (
        <div className="investor-detail-page">
            <div className="investor-detail-container">

                {/* Top bar */}
                <div className="detail-topbar">
                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/investors")
                        }
                    >
                        ← Quay lại
                    </button>

                    <LogoutButton />
                </div>

                {/* Investor header */}
                <div className="investor-detail-header">
                    <h1>
                        {investor.investorName}
                    </h1>

                    <p className="investor-detail-code">
                        {investor.investorCode}
                    </p>
                </div>

                {/* Main card */}
                <div className="investor-detail-card">

                    {/* Card header */}
                    <div className="detail-card-header">
                        <h2 className="detail-card-title">
                            Thông tin nhà đầu tư
                        </h2>

                        {!editing ? (
                            <button
                                className="primary-button"
                                onClick={handleEdit}
                            >
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="detail-actions">
                                <button
                                    className="secondary-button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Hủy
                                </button>

                                <button
                                    className="primary-button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Đang lưu..."
                                        : "Lưu"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Information */}
                    <div className="investor-detail-content">
                        <div className="investor-detail-grid">

                            {/* Họ tên */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Họ tên
                                </span>

                                {editing ? (
                                    <input
                                        className="detail-input"
                                        value={
                                            formData.investorName ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "investorName",
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="detail-value">
                                        {
                                            investor.investorName
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Ngày sinh */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Ngày sinh
                                </span>

                                {editing ? (
                                    <input
                                        className="detail-input"
                                        type="date"
                                        value={
                                            formData.dateOfBirth
                                                ? formData.dateOfBirth.slice(
                                                      0,
                                                      10
                                                  )
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "dateOfBirth",
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="detail-value">
                                        {formatDate(
                                            investor.dateOfBirth
                                        )}
                                    </span>
                                )}
                            </div>

                            {/* Loại nhà đầu tư */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Loại nhà đầu tư
                                </span>

                                <span className="detail-value">
                                    {getInvestorTypeText(
                                        investor.investorType
                                    )}
                                </span>
                            </div>

                            {/* Trạng thái */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Trạng thái
                                </span>

                                <span
                                    className={`detail-status ${getStatusClass(
                                        investor.status
                                    )}`}
                                >
                                    {getStatusText(
                                        investor.status
                                    )}
                                </span>
                            </div>

                            {/* Giới tính */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Giới tính
                                </span>

                                {editing ? (
                                    <select
                                        className="detail-select"
                                        value={
                                            formData.gender ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "gender",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="MALE">
                                            Nam
                                        </option>

                                        <option value="FEMALE">
                                            Nữ
                                        </option>
                                    </select>
                                ) : (
                                    <span className="detail-value">
                                        {getGenderText(
                                            investor.gender
                                        )}
                                    </span>
                                )}
                            </div>

                            {/* Quốc tịch */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Quốc tịch
                                </span>

                                {editing ? (
                                    <input
                                        className="detail-input"
                                        value={
                                            formData.nationality ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "nationality",
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="detail-value">
                                        {
                                            investor.nationality
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Số điện thoại */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Số điện thoại
                                </span>

                                {editing ? (
                                    <input
                                        className="detail-input"
                                        value={
                                            formData.phoneNumber ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "phoneNumber",
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="detail-value">
                                        {
                                            investor.phoneNumber
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Email
                                </span>

                                {editing ? (
                                    <input
                                        className="detail-input"
                                        type="email"
                                        value={
                                            formData.email ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="detail-value">
                                        {investor.email}
                                    </span>
                                )}
                            </div>

                            {/* Địa chỉ */}
                            <div className="detail-item full-width">
                                <span className="detail-label">
                                    Địa chỉ thường trú
                                </span>

                                {editing ? (
                                    <input
                                        className="detail-input"
                                        value={
                                            formData.permanentAddress ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "permanentAddress",
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="detail-value">
                                        {
                                            investor.permanentAddress
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Ngày tạo */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Ngày tạo
                                </span>

                                <span className="detail-value detail-readonly">
                                    {formatDate(
                                        investor.createdAt
                                    )}
                                </span>
                            </div>

                            {/* Cập nhật */}
                            <div className="detail-item">
                                <span className="detail-label">
                                    Cập nhật lần cuối
                                </span>

                                <span className="detail-value detail-readonly">
                                    {formatDate(
                                        investor.updatedAt
                                    )}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestorDetail;