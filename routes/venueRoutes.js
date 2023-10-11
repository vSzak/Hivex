const { validateRequest, BadRequestError } = require("@dqticket/common");
const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../middleware/asyncHandler");
const { currentVenue } = require("../middleware/current-venue");
const Venue = require("../models/venueModel");

const router = express.Router();

// Sign up
// POST /api/venues/signup
router.post(
    "/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("Password must be between 3 and 20 characters"),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { name, address, email, password } = req.body;
        const existingVenue = await Venue.findOne({ email });

        if (existingVenue) {
            console.log("Email in use");
            throw new BadRequestError("Email in use");
        }

        const venue = await Venue.create({
            name,
            address,
            email,
            password,
        });
        await venue.save();

        // Generate JWT
        const venueJwt = jwt.sign(
            { id: venue.id, email: venue.email },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: venueJwt,
        };

        res.status(201).send(venue);
    })
);

// Sign in
// POST /api/venues/signin
router.post(
    "/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password"),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const existingVenue = await Venue.findOne({ email });
        if (!existingVenue) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await existingVenue.matchPassword(password);

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // Generate JWT
        const venueJwt = jwt.sign(
            {
                id: existingVenue.id,
                email: existingVenue.email,
            },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: venueJwt,
        };

        res.status(200).send(existingVenue);
    })
);

// Sign out
// POST /api/venues/signout
router.post("/signout", (req, res) => {
    req.session = null;

    res.send({});
});

// Current user
// GET /api/venues/profile
router.get("/profile", currentVenue, (req, res) => {
    res.send({ currentVenue: req.currentVenue || null });
});

module.exports = router;
