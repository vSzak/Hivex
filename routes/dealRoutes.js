const { BadRequestError, NotFoundError } = require("@dqticket/common");
const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const { currentVenue } = require("../middleware/current-venue");
const Deal = require("../models/dealModel");

const router = express.Router();

// Create deal
// POST /api/deals
router.post(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const { title, totalCreated, value, expiry, description } = req.body;

        const deal = await Deal.create({
            title,
            totalCreated,
            value,
            expiry,
            description,
            venueId: req.currentVenue.id,
        });
        await deal.save();

        res.status(201).send(deal);
    })
);

// get all deals
// GET /api/deals
router.get(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const deal = await Deal.find({
            venueId: req.currentVenue.id,
        });

        res.send(deal);
    })
);

//get single deal
//GET /api/deals/:title
router.get(
    "/:title",
    currentVenue,
    asyncHandler(async (req, res) => {
        const title = req.params.title
        const deal = await Deal.findOne({title})

        if (!deal) {
            throw new NotFoundError()
        }
        if (deal.isInactive == false){
            throw new BadRequestError("Deal inactive")
        }
        else {
            res.send(deal)
        }
    })
)

// activate the deal
//POST /api/deals/activate
router.post(
    "/deals/activate",
    asyncHandler(async (req, res) => {
        const {title} = req.body

        try {
            const deal = await Deal.findOne({title})

            if (deal) {
                deal.isActive = true
                await deal.save()

                res.json({message: 'Deal activated successfully'})
            } else {
                res.status(400).json({message: 'Deal not found'})
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal server error'})
        }
    })
)

module.exports = router