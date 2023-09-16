const { errorHandler } = require("@dqticket/common");
const express = require("express");
const { json } = require("body-parser");
const cookieSession = require("cookie-session");

const userRoutes = require("./routes/userRoutes");
const asyncHandler = require("./middleware/asyncHandler");

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
    res.send({ message: "v1" });
});

app.use("/api", userRoutes);

app.all("*", asyncHandler(async (req, res) => {
    throw new NotFoundError();
}));

app.use(errorHandler);

module.exports = { app };
