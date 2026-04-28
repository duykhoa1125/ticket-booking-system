import axiosClient from "@/lib/axiosClient";
import type { Cinema } from "./types";

const adminCinemaService = {
  getAllCinemas: async (): Promise<Cinema[]> => {
    const data = await axiosClient.get("/cinemas");

    if (Array.isArray(data)) {
      return data.map((cinema: any) => ({
        cinema_id: cinema.id || cinema.cinema_id,
        name: cinema.name,
        state: cinema.status || cinema.state,
        address: cinema.address,
      }));
    }

    return [];
  },

  getCinemaById: async (id: string): Promise<Cinema> => {
    const data: any = await axiosClient.get(`/cinemas/${id}`);

    return {
      cinema_id: data.id || data.cinema_id,
      name: data.name,
      state: data.status || data.state,
      address: data.address,
    };
  },

  createCinema: (data: Omit<Cinema, "cinema_id">): Promise<Cinema> => {
    const backendData = {
      name: data.name,
      status: "active",
      address: data.address,
    };

    return axiosClient.post("/admin/cinemas", backendData);
  },

  updateCinema: (
    id: string,
    data: Partial<Omit<Cinema, "cinema_id">>,
  ): Promise<Cinema> => {
    const backendData: Record<string, unknown> = {};

    if (data.name !== undefined) backendData.name = data.name;
    if (data.address !== undefined) backendData.address = data.address;
    if (data.state !== undefined) backendData.status = data.state;

    return axiosClient.put(`/admin/cinemas/${id}`, backendData);
  },

  deleteCinema: (id: string): Promise<void> => {
    return axiosClient.delete(`/admin/cinemas/${id}`);
  },
};

export default adminCinemaService;
