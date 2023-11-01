// Import the 'mongoose' module, which is a MongoDB Object Modeling Tool
const mongoose = require("mongoose");

// Import the 'bcrypt' module, used for password hashing and validation
const bcrypt = require("bcryptjs");

// Define a schema for the 'Venue' model
const venueSchema = mongoose.Schema(
    {
        // 'name' is a string field for the venue's name, required
        name: {
            type: String,
            require: true,
        },
        // 'address' is a string field for the venue's address
        address: {
            type: String,
        },
        // 'email' is a string field for the venue's email, required and must be unique
        email: {
            type: String,
            require: true,
            unique: true,
        },
        // 'password' is a string field for the venue's password, required
        password: {
            type: String,
            required: true,
        },
        // 'coupons' is an array of references to 'Coupon' models
        coupons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coupon",
            },
        ],
        // 'offers' is an array of references to 'Offer' models
        offers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Offer",
            },
        ],
    },
    {
        // Configure timestamps to automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true,
        // Define how the document should be transformed when converted to JSON
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id; // Map '_id' to 'id'
                delete ret._id; // Remove '_id'
                delete ret.password; // Remove 'password' from the JSON representation
            },
        },
    }
);

// Define a method to compare the entered password with the stored hashed password
venueSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to encrypt the password using bcrypt before saving
venueSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Create a 'Venue' model using the defined schema
const Venue = mongoose.model("Venue", venueSchema);

// Export the 'Venue' model
module.exports = Venue;