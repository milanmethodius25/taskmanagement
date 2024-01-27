const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const config = require("../../config/config");
const { check, validationResult } = require("express-validator");
const Task = require("../../models/Task");
const jwt = require("jsonwebtoken");
const user_auth = require("../../middleware/user_auth");
const { jwt: { jwtAccessSecret, jwtRefreshSecret } } = config;
var bcrypt = require('bcryptjs');
const { is } = require("express/lib/request");

router.post(
    "/new_task",
    [
        check("task_name", "Task name Is Required").not().isEmpty(),
        check("description", "Description Is Required").not().isEmpty(),
        check("status", "Status is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var {
            task_name,
            description,
            status
        } = req.body;

        try {
            let new_task = new Task({
                user_id: req.user.id,
                task_name,
                description,
                status
            });

            await new_task.save();
            return res.status(200).send(new_task);


        } catch (err) {
            console.error(err.message);
            return res.status(500).send({ error: err.message });
        }
    }
);

router.get("/user", user_auth,
    async (req, res) => {
        try {
            let user_task = await Task.find({ user_id: req.user.id });
            if (!user_task) {
                return res.status(200).json({ message: "User task not found" });
            }
            return res.status(200).json({ user_task });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send({ error: err.message });
        }
    }
)

module.exports = router;