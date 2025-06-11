import { api } from "./client";

export const addNews = async (data: FormData) => {
  return api.post(`/news`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getNews = async () => {
  const { data } = await api.get(`/news`);
  return data;
};

export const getNewsById = async (id: string) => {
  const { data } = await api.get(`/news/${id}`);
  return data;
};

export const updateNews = async (id: string, data: FormData) => {
  return api.put(`/news/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteNews = async (id: string) => {
  return api.delete(`/news/${id}`);
};

export const getRecentsNews = async () => {
  const { data } = await api.get(`/news/recents`);
  return data;
};
