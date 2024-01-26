//admin middleware
//include this in any route to make it private.
//Any route without this middleware will be publicly available

const jwt = require("jsonwebtoken");
const config = require('../config/config');
const User = require("../models/User");

const { jwt: { jwtAccessSecret } } = config;

module.exports = async function (req, res, next) {
    //get token from header
    const token = req.header("x-auth-token");

    //check if no token

    if (!token) {
        return res.status(401).json({ error: "No token, auth denied" });
    }

    //verify token

    try {
        const decoded = jwt.verify(token, jwtAccessSecret);
        req.user = decoded.user;
        const user = await User.findOne({ _id: decoded.user.id }).select("_id");
        if (!user) {
            return res
                .status(400)
                .json({ error: "Invalid user or user not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: "Token invalid" });
    }
};