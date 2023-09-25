const path = require("path")
function randomRange(min, max) {
    return Math.floor(Math.random() * (max-min)) + min
}

function getViewsPath(fileName) {
    return path.join(process.cwd(), "views", fileName)
}

module.exports = {randomRange, getViewsPath}