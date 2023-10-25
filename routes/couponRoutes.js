const { BadRequestError, NotFoundError } = require("@dqticket/common");
const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const { currentVenue } = require("../middleware/current-venue");
const Coupon = require("../models/couponModel");
const Deal = require("../models/dealModel")
const voucher = require("voucher-code-generator")

const router = express.Router();

// Create coupon
// POST /api/coupons
router.post(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const { title, code, value, expiry } = req.body;
        const couponCode = voucher.generate({
            length: 4,
            charset: 'alphanumeric',
            count: Deal.totalCreated,
        })

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

//get single coupon
//GET /api/coupons/:code
router.get(
    "/:code",
    currentVenue,
    asyncHandler(async (req, res) => {
        const code = req.params.code
        const coupon = await Coupon.findOne({code})

        if (!coupon) {
            throw new NotFoundError()
        }
        if (coupon.expiry < new Date()/1000){
            throw new BadRequestError("Coupon Expired")
        }
        else {
            res.send(coupon)
        }
    })
)

module.exports = router;
