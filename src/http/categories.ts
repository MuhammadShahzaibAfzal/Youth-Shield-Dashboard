/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./client";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const addCategory = async (data: any) => {
  return api.post("/categories", data);
};

export const deleteCategory = async (id: string) => {
  return api.delete(`/categories/${id}`);
};

export const updateCategory = async ({ _id, data }: any) => {
  return api.put(`/categories/${_id}`, data);
};
