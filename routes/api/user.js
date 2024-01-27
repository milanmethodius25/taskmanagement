const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const config = require("../../config/config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const user_auth = require("../../middleware/user_auth");
const { jwt: { jwtAccessSecret, jwtRefreshSecret } } = config;
var bcrypt = require('bcryptjs');
const { is } = require("express/lib/request");

router.post(
    "/new",
    [
        check("user_name", "User Name Is Required").not().isEmpty(),
        check("email_address", "Email Address Is Required").isEmail(),
        check("password", "Password is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var {
            user_name,
            email_address,
            password
        } = req.body;

        email_address = email_address.toLowerCase();

        try {

            // let current_user = await User.findOne({
            //     email_address: email_address
            // });

            let new_user = new User({
                user_name: user_name,
                email_address: email_address,
                password: password
            });
            const salt = await bcrypt.genSalt(10);
            new_user.password = await bcrypt.hash(password, salt);
            await new_user.save();
            return res.status(200).send(new_user);


        } catch (err) {
            console.error(err.message);
            return res.status(500).send({ error: err.message });
        }
    }
);

router.post(
    "/login",
    [
        check("email_address", "Please Enter A Valid Email").isEmail(),
        check("password", "Password Is Required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        var { email_address, password } = req.body;
        email_address = email_address.toLowerCase();
        try {
            // See if admin exisit
            let user = await User.findOne({ email_address });

            if (!user) {
                return res
                    .status(400)
                    .json({ error: " User with this email address is not founf" });
            }


            // match password

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ error: "Invalid Credentials" });
            }

            // Return jwt
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                jwtAccessSecret,
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, data: user });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: `Something Went Wrong : ${err.message}` });
        }
    }
);


module.exports = router;