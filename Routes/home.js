"use strict"
const path = require("path")

function homePage(req, res) {
    res.sendFile(utils.get_views_path("../Front-End/register.js"))
}

module.exports = {
    homePage
}