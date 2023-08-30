"use strict"
const bcryptjs = require("bcryptjs")
const db = require("../Source/db-client")
const Member = require("../Source/member")
const Venue = require("../Source/venue")

function dashboard_page(req, res) {

    if (req.session.user === undefined) {
        res.redirect("/login")
        return;
    }

    if (req.session.isVenue) {
        res.sendFile(utils.get_views_path("venue-dashboard.html"))
    } else {
        res.sendFile(utils.get_views_path("dashboard.html"))
    }
}

module.exports = {
    dashboard_page
}