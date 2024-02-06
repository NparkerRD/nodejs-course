const express = require("express");
const morgan = require("morgan");

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
  // applies to every request
  console.log("Hello from the middleware 👋");
  next(); // always use next in middleware
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;

/*
App Flow:

1. Request is recieved in server.js (linked to app.js)
2. Enter router, (e.g tourRouter)
3. Execute controller (e.g tourController)
4. Response is sent and response request cycle is complete

*/
