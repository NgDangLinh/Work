import api from "./axios";

export interface Investor {
    investorCode: string;
    investorName: string;
    investorType: string;
    status: string;

    dateOfBirth: string;
    gender: string;

    idNumber: string;
    idIssuedDate: string;
    idIssuedPlace: string;
    idExpiryDate: string;

    nationality: string;

    permanentAddress: string;

    contactAddress: {
        province: string;
        district: string;
        ward: string;
        streetAddress: string;
    };

    phoneNumber: string;
    email: string;

    hasAuthorizedTrader: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface UpdateInvestorData {
    investorName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;

    phoneNumber?: string;
    email?: string;

    permanentAddress?: string;

    contactAddress?: {
        province?: string;
        district?: string;
        ward?: string;
        streetAddress?: string;
    };

    idNumber?: string;
    idIssuedDate?: string;
    idIssuedPlace?: string;
    idExpiryDate?: string;

    hasAuthorizedTrader?: boolean;

    referralCode?: string;

    identityDocuments?: unknown[];
}

export interface GetInvestorsParams {
    limit?: number;
    offset?: number;
    investorName?: string;
    status?: string;
    investorType?: string;
    createdAtGte?: string;
    createdAtLte?: string;
}


export const getInvestors = async (
    params?: GetInvestorsParams
) => {
    const response = await api.get("/admin/investors", {
        params: {
            "createdAt[sort]": "desc",
            limit: params?.limit ?? 20,
            offset: params?.offset ?? 0,

            ...(params?.investorName && {
                "investorName[contains]": params.investorName,
            }),

            ...(params?.status && {
                "status[eq]": params.status,
            }),

            ...(params?.investorType && {
                "investorType[eq]": params.investorType,
            }),

            ...(params?.createdAtGte && {
                "createdAt[gte]": params.createdAtGte,
            }),

            ...(params?.createdAtLte && {
                "createdAt[lte]": params.createdAtLte,
            }),
        },
    });

    
    return response.data;
};

export const getInvestorDetail = async (investorCode: string) => {
    const response = await api.get(`/admin/investors/${investorCode}`);

    return response.data;
};


export const updateInvestor = async (
    investorCode: string,
    data: UpdateInvestorData
) => {
    const response = await api.patch(
        `/admin/investors/${investorCode}`,
        data
    );

    return response.data;
};