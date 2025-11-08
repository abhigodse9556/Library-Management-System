import apiClient from "./apiClient";

export const getMembers = async () => {
  const response = await apiClient.get("/members/");
  return response.data;
};

export const getMember = async (id) => {
  const response = await apiClient.get(`/members/${id}/`);
  return response.data;
};

export const createMember = async (memberData) => {
  const response = await apiClient.post("/members/", memberData);
  return response.data;
};

export const updateMember = async (id, memberData) => {
  const response = await apiClient.put(`/members/${id}/`, memberData);
  return response.data;
};

export const deleteMember = async (id) => {
  const response = await apiClient.delete(`/members/${id}/`);
  return response.data;
};
