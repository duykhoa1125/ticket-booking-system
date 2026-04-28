import axiosClient from "@/lib/axiosClient";

export interface DashboardStats {
  total_movies: number;
  now_showing: number;
  coming_soon: number;
  total_cinemas: number;
  monthly_revenue: number;
  bookings_this_month: number;
}

export interface TopRevenueMovie {
  ma_phim: string;
  ten_phim: string;
  doanh_thu: number;
}

const adminDashboardService = {
  getDashboardStats: (): Promise<DashboardStats> => {
    return axiosClient.get("/admin/stats");
  },

  getTopRevenue: (): Promise<TopRevenueMovie[]> => {
    return axiosClient.get("/movies/top-revenue");
  },
};

export default adminDashboardService;
