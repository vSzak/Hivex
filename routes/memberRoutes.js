const { validateRequest, BadRequestError } = require("@dqticket/common");
const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../middleware/asyncHandler");
const { currentMember } = require("../middleware/current-member");
const Member = require("../models/memberModel");

const router = express.Router();

// Sign up
// POST /api/members/signup
router.post(
    "/members/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("Password must be between 3 and 20 characters"),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { firstName, lastName, email, password } = req.body;
        const existingMember = await Member.findOne({ email });

        if (existingMember) {
            console.log("Email in use");
            throw new BadRequestError("Email in use");
        }

        const member = await Member.create({
            firstName,
            lastName,
            email,
            password,
        });
        await member.save();

        // Generate JWT
        const memberJwt = jwt.sign(
            { id: member.id, email: member.email },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: memberJwt,
        };

        res.status(201).send(member);
    })
);

// Sign up (broker)
// POST /api/brokers/signup
router.post(
    "/brokers/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("Password must be between 3 and 20 characters"),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { firstName, lastName, email, password } = req.body;
        const existingMember = await Member.findOne({ email });

        if (existingMember) {
            console.log("Email in use");
            throw new BadRequestError("Email in use");
        }

        const member = await Member.create({
            firstName,
            lastName,
            email,
            password,
            isBroker: true,
        });
        await member.save();

        // Generate JWT
        const memberJwt = jwt.sign(
            { id: member.id, email: member.email },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: memberJwt,
        };

        res.status(201).send(member);
    })
);

// Sign in
// POST /api/members/signin
router.post(
    "/members/signin",
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

        const existingMember = await Member.findOne({ email });
        if (!existingMember) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await existingMember.matchPassword(password);

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: existingMember.id,
                email: existingMember.email,
            },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingMember);
    })
);

// Sign out
// POST /api/members/signout
router.post("/members/signout", (req, res) => {
    req.session = null;

    res.send({});
});

// Current user
// GET /api/members/profile
router.get("/members/profile", currentMember, (req, res) => {
    res.send({ currentMember: req.currentMember || null });
});

module.exports = router;
