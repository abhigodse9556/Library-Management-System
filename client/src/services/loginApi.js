import apiClient from "./apiClient";

export const login = async (payload) => {
  const response = await apiClient.post("/login/", payload);
  return response.data;
};
