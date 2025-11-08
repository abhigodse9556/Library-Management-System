import apiClient from "./apiClient";

export const getChoices = async (params = {}) => {
  const response = await apiClient.get("/choices", { params });
  return response.data;
};
