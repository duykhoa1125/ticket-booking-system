const login = require("./login_route");
const movieRouter = require("./movie_route");
const cinemaRouter = require("./cinema_route");
const showtimeRouter = require("./showtime_route");
const bookingRouter = require("./booking_route");
const otherRouter = require("./other_route");
const promotionRouter = require("./promotion_route");
const adminRouter = require("./admin_route");
const reviewRouter = require("./review_route");
function router(app) {
  app.use("/auth", login);
  app.use("/cinemas", cinemaRouter);
  app.use("/movies", movieRouter);
  app.use("/showtimes", showtimeRouter);
  app.use("/booking", bookingRouter);
  app.use("/other", otherRouter);
  app.use("/promotions", promotionRouter);
  app.use("/admin", adminRouter);
  app.use("/reviews", reviewRouter);

  app.get("/health/db", async (req, res) => {
    try {
      await executeQuery("SELECT 1");
      res.status(200).json({ database: "Connected" });
    } catch {
      res.status(500).json({ database: "Disconnected" });
    }
  });
}

module.exports = router;
