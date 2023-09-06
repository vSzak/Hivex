"use strict"
const bcryptjs = require("bcryptjs")
const db = require("../Source/db-client")
const Member = require("../Source/member")
const path = require("path")

function registerPage (req, res) {
    if (req.session.user !== undefined) {
        res.redirect("/dashboard")
        return
    }

    res.sendFile(utils.get_views_path("register.html"))
}

// Password minimum rules
//const passwordRegex = new RegExp("^(?=.*[A-Za-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$", "i")

function registerFormSubmit (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    
        req.check(req.body.password).matches("^(?=.*[A-Za-Z])(?=.*[#$@!%&*?])(?=.*\d)[A-Za-z#$@!%&*??=.*\\d]{8,}$", "i")

        try {

            let isBroker = false
            let hash = yield bcryptjs.hash(req.body.password, 10)
            let member = new Member(req.body.id, req.body.first_name, req.body.last_name, req.body.email, hash, isBroker);
            var documentCount = yield db.member_collection.countDocuments({email: req.body.email}, {limit: 1})

            if (documentCount == 0) {

                let result = yield db.member_collection.insertOne(member)
                if (result) {
                    log.info(`User Successfully added [USER: ${member.email_address}]`)
                    res.redirect("/login")
                } else {
                    log.error("Failed to create user")
                    res.redirect("/register")
                }
            }
        } catch (err) {
            log.error(`Failed Registering due to internal error: ${err}`)
            if (!res.writableEnded) {
                res.sendStatus(500)
            }
        }
    })
}

module.exports = {
    registerFormSubmit,
    registerPage
}