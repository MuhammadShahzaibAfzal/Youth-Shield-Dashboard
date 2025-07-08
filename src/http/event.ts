import { api } from "./client";

export const addEvent = async (data: FormData) => {
  return api.post(`/events`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getEvents = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  type?: "virtual" | "physical";
}) => {
  const { data } = await api.get(`/events/public`, { params });
  return data;
};

export const getEventById = async (id: string) => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

export const updateEvent = async (id: string, data: FormData) => {
  return api.put(`/events/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEvent = async (id: string) => {
  return api.delete(`/events/${id}`);
};

export const getUpcomingEvents = async (limit?: number) => {
  const { data } = await api.get(`/events/upcoming`, {
    params: { limit },
  });
  return data;
};

export const getRecentEvents = async () => {
  const { data } = await api.get(`/events/recents`);
  return data;
};

export const getEventBySlug = async (slug: string) => {
  const { data } = await api.get(`/events/slug/${slug}`);
  return data;
};

export const uploadEventImage = async (file: File) => {
  const formData = new FormData();
  formData.append("files[0]", file);
  const { data } = await api.post(`/events/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.url;
};
