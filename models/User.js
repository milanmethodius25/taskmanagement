const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    email_address: {
        type: String,
        unique: false,
        required: false
    },
    password: {
        type: String,
        required: false,
        default: "123456"
    },
}
);
module.exports = User = mongoose.model("user", UserSchema);