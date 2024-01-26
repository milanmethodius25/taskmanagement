const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false,
        enum: ['To DO', 'On Progress', 'Completed'],
        default: 'To DO'
    },
}
);
module.exports = Task = mongoose.model("task", TaskSchema);