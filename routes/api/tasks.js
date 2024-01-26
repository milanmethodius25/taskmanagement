const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const config = require("../../config/config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const admin_auth = require("../../middleware/admin_auth");
const { jwt: { jwtAccessSecret, jwtRefreshSecret } } = config;
var bcrypt = require('bcryptjs');
const { is } = require("express/lib/request");

router.post(
    "/new_task",
    [
        check("task_name", "Task name Is Required").not().isEmpty(),
        check("description", "Description Is Required").isEmail(),
        check("status", "Status is required").not().isEmpty(),
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
            let new_user = new User({
                user_name: user_name,
                email_address: email_address,
                password: password
            });
            const salt = await bcrypt.genSalt(10);
            new_admin.password = await bcrypt.hash(password, salt);
            await new_user.save();
            return res.status(200).send(new_user);


        } catch (err) {
            console.error(err.message);
            return res.status(500).send({ error: err.message });
        }
    }
);