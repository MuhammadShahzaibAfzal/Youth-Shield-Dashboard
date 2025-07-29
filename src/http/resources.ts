import { api } from "./client";

// ------------------- CATEGORY APIs -------------------

export const addCategory = async (data: { name: string; description?: string }) => {
  const { data: res } = await api.post(`/resources/categories`, data);
  return res;
};

export const getCategories = async () => {
  const { data } = await api.get(`/resources/categories`);
  return data;
};

export const getCategoryById = async (id: string) => {
  const { data } = await api.get(`/resources/categories/${id}`);
  return data;
};

export const updateCategory = async ({
  _id,
  name,
  description,
}: {
  _id: string;
  name: string;
  description?: string;
}) => {
  const { data: updated } = await api.put(`/resources/categories/${_id}`, {
    name,
    description,
  });
  return updated;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/resources/categories/${id}`);
  return data;
};

// ------------------- RESOURCE APIs -------------------

export const addResource = async (formData: FormData) => {
  return api.post(`/resources`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateResource = async (id: string, formData: FormData) => {
  return api.put(`/resources/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteResource = async (id: string) => {
  return api.delete(`/resources/${id}`);
};

export const getAllResources = async () => {
  const { data } = await api.get(`/resources/admin`);
  return data;
};

export const getResources = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}) => {
  const { data } = await api.get(`/resources`, { params });
  return data;
};

export const getResourceById = async (id: string) => {
  const { data } = await api.get(`/resources/${id}`);
  return data;
};

export const getResourcesByCategory = async (categoryId: string) => {
  const { data } = await api.get(`/resources/category/${categoryId}`);
  return data;
};
