import adminMovieService from "./adminMovieService";
import adminCinemaService from "./adminCinemaService";
import adminShowtimeService from "./adminShowtimeService";
import adminDashboardService, {
  type DashboardStats,
  type TopRevenueMovie,
} from "./adminDashboardService";

const adminService = {
  ...adminMovieService,
  ...adminCinemaService,
  ...adminShowtimeService,
  ...adminDashboardService,
};

export type { DashboardStats, TopRevenueMovie };
export default adminService;
