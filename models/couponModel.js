const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
    {
        title: {
          type: String,
        },
        code: {
          type: String,
        },
        value: {
          type: String,
        },
        expiry: {
          type: Date,
          required: true,
          default: Date.now() + 7*24*60*60*1000, // 1 week
        },
        memberId: {
          type: String,
        },
        venueId: {
          type: String,
          required: true
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

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
