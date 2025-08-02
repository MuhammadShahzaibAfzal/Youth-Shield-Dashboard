import { api } from "./client";

// ------------------- CATEGORY APIs -------------------

export const addIndependentCategory = async (data: {
  name: string;
  description?: string;
  icon?: string;
}) => {
  const { data: res } = await api.post(`/independent-research/categories`, data);
  return res;
};

export const getIndependentCategories = async () => {
  const { data } = await api.get(`/independent-research/categories`);
  return data;
};

export const getIndependentCategoryById = async (id: string) => {
  const { data } = await api.get(`/independent-research/categories/${id}`);
  return data;
};

export const updateIndependentCategory = async ({
  _id,
  name,
  description,
  icon,
}: {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}) => {
  const { data: updated } = await api.put(`/independent-research/categories/${_id}`, {
    name,
    description,
    icon,
  });
  return updated;
};

export const deleteIndependentCategory = async (id: string) => {
  const { data } = await api.delete(`/independent-research/categories/${id}`);
  return data;
};

// ------------------- RESOURCE APIs -------------------

export const addIndependentResource = async (formData: FormData) => {
  return api.post(`/independent-research`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateIndependentResource = async (id: string, formData: FormData) => {
  return api.put(`/independent-research/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteIndependentResource = async (id: string) => {
  return api.delete(`/independent-research/${id}`);
};

export const getAllIndependentResources = async () => {
  const { data } = await api.get(`/independent-research/admin`);
  return data;
};

export const getIndependentResources = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}) => {
  const { data } = await api.get(`/independent-research`, { params });
  return data;
};

export const getIndependentResourceById = async (id: string) => {
  const { data } = await api.get(`/independent-research/${id}`);
  return data;
};

export const getIndependentResourcesByCategory = async (categoryId: string) => {
  const { data } = await api.get(`/independent-research/category/${categoryId}`);
  return data;
};
