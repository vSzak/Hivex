const jwt = require("jsonwebtoken")

const currentVenue = (req, res, next) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentVenue = payload;
    } catch (err) {}

    next();
};

module.exports = { currentVenue };
