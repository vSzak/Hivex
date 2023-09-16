const mongoose = require("mongoose");
require("dotenv").config();

const { app } = require("./server");

const start = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connecting to MongoDB");
        console.log(process.env.MONGODB_URI);
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
};

start();
