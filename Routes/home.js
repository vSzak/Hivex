"use strict"
const path = require("path")
const utils = require("../Source/utils")

function homePage(req, res) {
    res.sendFile(utils.getViewsPath("../Front-End/register.html"))
}

module.exports = {
    homePage
}