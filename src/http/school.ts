import { api } from "./client";

// http/school.ts
export const getSchools = async (queryParams: string) => {
  const { data } = await api.get("/auth/admin/schools?" + queryParams);
  return data;
};

export const createSchool = async (data: { name: string; isApproved?: boolean }) => {
  const { data: res } = await api.post(`/auth/schools`, data);
  return res;
};

export const updateSchool = async (
  id: string,
  data: { name?: string; isApproved?: boolean }
) => {
  const { data: res } = await api.put(`/auth/admin/schools/${id}`, data);
  return res;
};

export const updateBulk = async (ids: string[], isApproved: boolean) => {
  const { data: res } = await api.put(`/auth/admin/bulk-update`, {
    isApproved,
    ids,
  });
  return res;
};
