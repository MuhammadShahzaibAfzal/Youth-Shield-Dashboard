import { api } from "./client";

const BASE_URL = "/screenings";

export const addScreening = async (data: FormData) => {
  return api.post(`${BASE_URL}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getScreenings = async () => {
  const { data } = await api.get(`${BASE_URL}`);
  return data;
};

export const getScreening = async (id: string) => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
};

export const deleteScreening = async (id: string) => {
  return api.delete(`${BASE_URL}/${id}`);
};

export const updateScreening = async (id: string, data: FormData) => {
  return api.put(`${BASE_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
