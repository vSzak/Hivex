const mongoose = require("mongoose");

const dealSchema = mongoose.Schema(
    {
        title: {
          type: String,
          unique: true,
        },
        totalCreated: {
            type: Number,
            default: 1,
        },
        value: {
          type: String,
        },
        expiry: {
          type: Date,
          required: true,
          default: Date.now() + 7*24*60*60*1000, // 1 week
        },
        description: {
          type: String,
        },
        venueId: {
          type: String,
          required: true
        },
        isActive: {
          type: Boolean,
          default: false,
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;