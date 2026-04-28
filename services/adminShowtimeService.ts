import axiosClient from "@/lib/axiosClient";
import type { Showtime } from "./types";

const adminShowtimeService = {
  getAllShowtimes: (): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes");
  },

  getShowtimeById: async (id: string): Promise<Showtime> => {
    const response: any = await axiosClient.get(`/admin/showtimes/${id}`);

    if (response.start_date) {
      const date = new Date(response.start_date);
      response.start_date = date.toISOString().split("T")[0];
    }

    return response as Showtime;
  },

  createShowtime: (data: Omit<Showtime, "showtime_id">): Promise<Showtime> => {
    const backendData = {
      roomId: data.room_id,
      movieId: data.movie_id,
      date: data.start_date,
      startTime: data.start_time,
      endTime: data.end_time,
    };

    return axiosClient.post("/admin/showtimes", backendData);
  },

  updateShowtime: (
    id: string,
    data: Partial<Omit<Showtime, "showtime_id">>,
  ): Promise<Showtime> => {
    const backendData: Record<string, unknown> = {};

    if (data.room_id !== undefined) backendData.roomId = data.room_id;
    if (data.movie_id !== undefined) backendData.movieId = data.movie_id;
    if (data.start_date !== undefined) backendData.date = data.start_date;
    if (data.start_time !== undefined) backendData.startTime = data.start_time;
    if (data.end_time !== undefined) backendData.endTime = data.end_time;

    return axiosClient.put(`/admin/showtimes/${id}`, backendData);
  },

  deleteShowtime: (id: string): Promise<void> => {
    return axiosClient.delete(`/admin/showtimes/${id}`);
  },
};

export default adminShowtimeService;
