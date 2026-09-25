import api from "./axios";

export const getMe = async () => {
  const response = await api.get("/admin/me");

  return response.data;
};