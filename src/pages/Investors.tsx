import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvestors } from "../api/investors";
import type { Investor } from "../api/investors";
import "./Investors.css";
import LogoutButton from "../components/LogoutButton";

function Investors() {
    const navigate = useNavigate();

    const [investors, setInvestors] = useState<Investor[]>([]);

    const [investorType, setInvestorType] = useState<
        "" | "INDIVIDUAL" | "ENTERPRISE"
    >("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    const [page, setPage] = useState(1);
    const limit = 20;

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const offset = (page - 1) * limit;

    // Reset về trang 1 khi search/filter thay đổi
    useEffect(() => {
        setPage(1);
    }, [investorType, search, status, createdAt]);

    const getDateRange = () => {
        if (!createdAt) {
            return {
                createdAtGte: undefined,
                createdAtLte: undefined,
            };
        }

        return {
            createdAtGte: `${createdAt}T00:00:00.000Z`,
            createdAtLte: `${createdAt}T23:59:59.999Z`,
        };
    };

    // Fetch investors
    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchInvestors = async () => {
                try {
                    setLoading(true);

                    const dateRange = getDateRange();

                    const response = await getInvestors({
                        investorType:
                            investorType || undefined,

                        investorName:
                            search || undefined,

                        status:
                            status || undefined,

                        createdAtGte:
                            dateRange.createdAtGte,

                        createdAtLte:
                            dateRange.createdAtLte,

                        limit,
                        offset,
                    });

                    console.log(
                        "Investors response:",
                        response
                    );

                    setInvestors(response.data);
                    setTotal(
                        response.pagination.totalRows
                    );
                } catch (error) {
                    console.error(
                        "Get investors failed:",
                        error
                    );
                } finally {
                    setLoading(false);
                }
            };

            fetchInvestors();
        }, 500);

        return () => clearTimeout(timer);
    }, [
        investorType,
        search,
        status,
        createdAt,
        offset,
    ]);

    const totalPages = Math.ceil(total / limit);

    const formatDate = (value: string) => {
        if (!value) return "—";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("vi-VN");
    };

    const getStatusClass = (value: string) => {
        switch (value) {
            case "APPROVED":
                return "status-badge status-approved";

            case "PENDING":
                return "status-badge status-pending";

            case "REJECTED":
                return "status-badge status-rejected";

            default:
                return "status-badge";
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
                return "Không xác định";
        }
    };

    const getInvestorTypeText = (value: string) => {
        switch (value) {
            case "INDIVIDUAL":
                return "Cá nhân";

            case "ENTERPRISE":
                return "Doanh nghiệp";

            default:
                return "Không xác định";
        }
    };

    return (
        <div className="investors-page">
            <div className="investors-container">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            Danh sách nhà đầu tư
                        </h1>

                        <p className="page-description">
                            Quản lý và theo dõi thông tin các nhà đầu tư
                        </p>
                    </div>

                    <LogoutButton />
                </div>

                {/* Tabs */}
                <div className="investor-tabs">
                    <button
                        className={`investor-tab ${investorType === ""
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            setInvestorType("")
                        }
                    >
                        Tất cả
                    </button>

                    <button
                        className={`investor-tab ${investorType ===
                                "INDIVIDUAL"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            setInvestorType(
                                "INDIVIDUAL"
                            )
                        }
                    >
                        Cá nhân
                    </button>

                    <button
                        className={`investor-tab ${investorType ===
                                "ENTERPRISE"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            setInvestorType(
                                "ENTERPRISE"
                            )
                        }
                    >
                        Doanh nghiệp
                    </button>
                </div>

                {/* Filters */}
                <div className="investor-filters">
                    <input
                        className="investor-search"
                        type="text"
                        placeholder="Tìm theo họ tên..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        className="investor-filter"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="">
                            Tất cả trạng thái
                        </option>

                        <option value="PENDING">
                            Chờ duyệt
                        </option>

                        <option value="APPROVED">
                            Đã duyệt
                        </option>

                        <option value="REJECTED">
                            Từ chối
                        </option>
                    </select>

                    <input
                        className="investor-date"
                        type="date"
                        value={createdAt}
                        onChange={(e) =>
                            setCreatedAt(e.target.value)
                        }
                    />
                </div>

                {/* Table */}
                <div className="investor-table-card">
                    <table className="investor-table">
                        <thead>
                            <tr>
                                <th>Mã TKGD</th>
                                <th>Họ tên</th>
                                <th>Loại</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="table-empty"
                                    >
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : investors.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="table-empty"
                                    >
                                        Không tìm thấy nhà
                                        đầu tư
                                    </td>
                                </tr>
                            ) : (
                                investors.map(
                                    (investor) => (
                                        <tr
                                            key={
                                                investor.investorCode
                                            }
                                            className="investor-row"
                                        >
                                            <td>
                                                <span className="investor-code-cell">
                                                    {
                                                        investor.investorCode
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <span className="investor-name-cell">
                                                    {
                                                        investor.investorName
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {
                                                    getInvestorTypeText(
                                                        investor.investorType
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {
                                                    investor.email
                                                }
                                            </td>

                                            <td>
                                                {
                                                    investor.phoneNumber
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        investor.status
                                                    )}
                                                >
                                                    {getStatusText(
                                                        investor.status
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    investor.createdAt
                                                )}
                                            </td>

                                            <td className="table-action-cell">
                                                <button
                                                    type="button"
                                                    className="table-action-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/investors/${investor.investorCode}`
                                                        )
                                                    }
                                                    aria-label={`Xem chi tiết ${investor.investorName}`}
                                                >
                                                    ↗
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="investor-pagination">
                        <div className="pagination-info">
                            {total === 0
                                ? "Không có dữ liệu"
                                : `Hiển thị ${offset + 1
                                }–${Math.min(
                                    offset +
                                    investors.length,
                                    total
                                )} trong ${total} bản ghi`}
                        </div>

                        <div className="pagination-buttons">
                            <button
                                className="pagination-button"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                            >
                                ←
                            </button>

                            <span className="pagination-current">
                                Trang {page} /{" "}
                                {totalPages || 1}
                            </span>

                            <button
                                className="pagination-button"
                                disabled={
                                    page >=
                                    totalPages ||
                                    totalPages === 0
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Investors;