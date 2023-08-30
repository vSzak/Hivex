"use strict"
function homePage(req, res) {
    res.sendFile(utils.get_views_path("index.html"))
}

module.exports = {
    homePage
}