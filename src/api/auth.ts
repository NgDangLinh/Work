import api from "./axios";

interface LoginRequest {
  username: string;
  password: string;
  type: number;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post("/investor/login", data);

  return response.data;
};