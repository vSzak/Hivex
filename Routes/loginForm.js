/*"use strict"
const bcryptjs = require("bcryptjs")
const db = require("../Source/db-client")
const Member = require("../Source/member")
const Venue = require("../Source/venue")
const path = require("path")

function loginPage (req, res) {
    if (req.session.user !== undefined) {
        res.redirect("/dashboard")
        return
    }

    res.set("Cache-Control", "no-store")
    res.sendFile(utils.get_views_path("login.js"))
}

function loginFormSubmit (req, res) {
    return __awaiter(this, void 0, void 0, function * () {
        try {

            let req_email = req.body.email_address
            let req_password = req.body.req_password
            let isVenue = false
            let user

            if (user === null) {
                res.redirect("/login")
                return
            }

            const valid = yield bcryptjs.compare(req_password, user.password)
            const Venue = yield db.venues_collection.findOne<Venue>({"email address": req_email})

            if (valid) {
                log.info(`Successful login attempt [USER: ${user.email_address}]`)
                req.session.regenerate(function () {

                    req.session.user = user
                    req.session.isVenue = isVenue
                    res.redirect("/dashboard")
                })
            } else if (Venue) {
                isVenue = true

                log.info(`Successful login attempt [VENUE: ${user.email_address}]`)
                req.session.regenerate(function () {

                    req.session.user = user
                    req.session.isVenue = isVenue
                    res.redirect("/venue-dashboard")
                })
                
            } else {
                log.warning(`Failed login attempt with incorrect password [USER: ${user.email_address}]`)
                res.redirect("/login")
            }
        } catch (err) {
            log.error(`Failed login due to internal error: ${err}`)
            if (!res.writableEnded) {
                res.sendStatus(500)
            }
        }
    })
}

function logout (req, res) {
    req.session.destroy(function () {})
    res.redirect("/")
}

module.exports = {
    loginPage,
    loginFormSubmit,
    logout
}*/
module.exports = {
    loginPage,
    logout
};

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { join } = require("path");
const { Member } = require("../Source/member");
const utils = require("./utils");

router.get("/", loginPage);
router.post("/", loginValidation, loginUser);

function loginPage (req, res) {
    if (req.session && req.session.user !== undefined) {
        res.redirect("/dashboard");
        return;
    }

    res.set("Cache-Control", "no-store");
    res.sendFile(utils.get_views_path("login.js"));
}

function loginValidation (req, res, next) {
    const validation = [
        body("email").isEmail().withMessage("Invalid email address"),
        body("password").notEmpty().withMessage("Password is required")
    ];

    Promise.all(validation.map((validation) => validation.run(req)))
        .then(() => next())
        .catch((errors) => {
            const errorMessages = errors.map((error) => error.msg);
            res.status(400).json({ errors: errorMessages });
        });
}

function loginUser (req, res) {
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
            return;
        }

        if (!user) {
            res.status(400).json({ errors: ["Invalid email or password"] });
            return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal server error");
                return;
            }

            if (!result) {
                res.status(400).json({ errors: ["Invalid email or password"] });
                return;
            }

            req.session.user = user._id;
            res.redirect("/dashboard");
        });
    });
}

function logout (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
            return;
        }

        res.redirect("/");
    });
}