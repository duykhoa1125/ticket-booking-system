import axiosClient from "@/lib/axiosClient";
import type { Movie } from "./types";

const adminMovieService = {
  getAllMovies: (): Promise<Movie[]> => {
    return axiosClient.get("/movies");
  },

  createMovie: (
    data: Omit<Movie, "movie_id">,
    directors?: string[],
    actors?: string[],
  ): Promise<Movie> => {
    const backendData = {
      title: data.name,
      duration: data.duration,
      releaseDate: data.release_date,
      endDate: data.end_date,
      ageRating: data.age_rating,
      trailer: data.trailer,
      language: data.language,
      status: data.status,
      summary: data.synopsis,
      image: data.image,
      directors: directors || [],
      actors: actors || [],
    };

    return axiosClient.post("/admin/movies", backendData);
  },

  updateMovie: (
    id: string,
    data: Partial<Omit<Movie, "movie_id">>,
    directors?: string[],
    actors?: string[],
  ): Promise<Movie> => {
    const backendData: Record<string, unknown> = {};

    if (data.name !== undefined) backendData.title = data.name;
    if (data.duration !== undefined) backendData.duration = data.duration;
    if (data.release_date !== undefined)
      backendData.releaseDate = data.release_date;
    if (data.end_date !== undefined) backendData.endDate = data.end_date;
    if (data.age_rating !== undefined) backendData.ageRating = data.age_rating;
    if (data.trailer !== undefined) backendData.trailer = data.trailer;
    if (data.language !== undefined) backendData.language = data.language;
    if (data.status !== undefined) backendData.status = data.status;
    if (data.synopsis !== undefined) backendData.summary = data.synopsis;
    if (data.image !== undefined) backendData.image = data.image;
    if (directors !== undefined) backendData.directors = directors;
    if (actors !== undefined) backendData.actors = actors;

    return axiosClient.put(`/admin/movies/${id}`, backendData);
  },

  deleteMovie: (id: string): Promise<void> => {
    return axiosClient.delete(`/admin/movies/${id}`);
  },
};

export default adminMovieService;
