// Core Dependencies
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Custom Dependencies
require("./src/db/mongoose").db().then();
require("./src/schedule/cronJob");
const { logger } = require("./src/utils/logger");
const { PORT } = require("./src/core/config");

// Routers
const baseRouter = require("./src/router");
const apartmentRouter = require("./src/router/apartmentRouter");
const userRouter = require("./src/router/userRouter");
const eventRouter = require("./src/router/eventRouter");
const bankRouter = require("./src/router/bankRouter");
const walletRouter = require("./src/router/walletRouter");
const transactionRouter = require("./src/router/transactionRouter");
const bookingRouter = require("./src/router/bookingRouter");
const notificationRouter = require("./src/router/notificationRouter");
// App Init
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));
app.use(morgan("tiny"));

// Router Middleware
app.use("/", baseRouter);
app.use("/api", apartmentRouter);
app.use("/api", userRouter);
app.use("/api", eventRouter);
app.use("/api", bankRouter);
app.use("/api", walletRouter);
app.use("/api", transactionRouter);
app.use("/api", bookingRouter);
app.use("/api", notificationRouter);

app.listen(PORT, () =>
  logger.info(`Booking Backend Service Started on port ${PORT}`)
);
