const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); // "Middleware" required to get the request body
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(x);

  next();
});

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
}); // * covers all routes not ALREADY used

app.use(globalErrorHandler);

module.exports = app;

/*
App Flow:

1. Request is recieved in server.js (linked to app.js)
2. Enter router, (e.g tourRouter)
3. Execute controller (e.g tourController)
4. Response is sent and response request cycle is complete

*/
