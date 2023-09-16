"use strict"
const bcryptjs = require("bcryptjs")
const db = require("../Source/db-client")
const Member = require("../Source/member")
const Venue = require("../Source/venue")
const path = require("path")

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

function brokerDashboard () {
    let isBroker = false

    var x = document.getElementById("BrokerButton")
    if (isBroker) {
        x.style.display = "none"
        isBroker = false
    } else {
        x.style.display = "block"
        isBroker = true
    }
}

module.exports = {
    dashboard_page,
    brokerDashboard
}