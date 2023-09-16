const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const venueSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        address: {
            type: String,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
            },
        },
    }
);

// Match user entered password to hashed password in database
venueSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
venueSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
