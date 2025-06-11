import { api } from "./client";

export const signin = async (data: { email: string; password: string }) => {
  return api.post(`/auth/login`, {
    email: data.email,
    password: data.password,
    role: "admin",
  });
};

export const self = async () => {
  return api.get(`/auth/self`);
};

export const logout = async () => {
  return api.post(`/auth/logout`);
};

export const forgetPassword = async (data: { email: string }) => {
  return api.post(`/auth/forget-password`, data);
};

export const resetPassword = async (data: {
  resetToken: string;
  newPassword: string;
}) => {
  return api.post(`/auth/reset-password`, data);
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return api.post(`/auth/change-password`, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProfile = async (data: any) => {
  return api.put(`/auth/update-profile`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
