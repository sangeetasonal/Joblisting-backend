const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobPosition: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ["Full-time", "Part-time", "Contract", "internship", "freelance"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

module.exports = mongoose.model("Job", jobSchema);