const jwt = require("jsonwebtoken")

const currentMember = (req, res, next) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentMember = payload;
    } catch (err) {}

    next();
};

module.exports = { currentMember };
