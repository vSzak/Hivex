const { errorHandler, NotFoundError } = require("@dqticket/common");
const express = require("express");
const { json } = require("body-parser");
const cookieSession = require("cookie-session");

const memberRoutes = require("./routes/memberRoutes");
const venueRoutes = require("./routes/venueRoutes");
const couponRoutes = require("./routes/couponRoutes");
const asyncHandler = require("./middleware/asyncHandler");
const apiEndpoints = require('./usage.json');

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV === "production",
    })
);
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
    res.send({ message: "v3" });
});

app.get("/", (req, res) => {
    res.send(apiEndpoints);
});

app.use("/api", memberRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/coupons", couponRoutes);

app.all("*", asyncHandler(async (req, res) => {
    throw new NotFoundError();
}));

app.use(errorHandler);

module.exports = { app };
