import { api } from "./client";

const BASE_URL = "/contests";

export const addContest = async (data: FormData) => {
  return api.post(BASE_URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getContests = async (params?: {
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get(BASE_URL, { params });
  return data;
};

export const getActiveContests = async () => {
  const { data } = await api.get(`${BASE_URL}/active`);
  return data;
};

export const getRecentContests = async (limit: number = 5) => {
  const { data } = await api.get(`${BASE_URL}/recents`, {
    params: { limit },
  });
  return data;
};

export const getContest = async (id: string) => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
};

export const getContestBySlug = async (slug: string) => {
  const { data } = await api.get(`${BASE_URL}/slug/${slug}`);
  return data;
};

export const deleteContest = async (id: string) => {
  return api.delete(`${BASE_URL}/${id}`);
};

export const updateContest = async (id: string, data: FormData) => {
  return api.put(`${BASE_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
