const { BadRequestError, NotFoundError } = require("@dqticket/common");
const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const { currentVenue } = require("../middleware/current-venue");
const Coupon = require("../models/couponModel");

const router = express.Router();

// Create coupon
// POST /api/coupons
router.post(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const { title, code, value, expiry } = req.body;

        const coupon = await Coupon.create({
            title,
            code,
            value,
            expiry,
            venueId: req.currentVenue.id,
        });
        await coupon.save();

        res.status(201).send(coupon);
    })
);

// get all coupons
// GET /api/coupons
router.get(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const coupons = await Coupon.find({
            venueId: req.currentVenue.id,
        });

        res.send(coupons);
    })
);

// get single coupon
// GET /api/coupons/:id
router.get(
    "/:id",
    currentVenue,
    asyncHandler(async (req, res) => {
        if (req.params.id.length !== 24) {
            throw new BadRequestError("Id must be 24 characters");
        }
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            throw new NotFoundError();
        }

        res.send(coupon);
    })
);

module.exports = router;
