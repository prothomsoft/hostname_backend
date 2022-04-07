const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    src: { type: String, required: true },
    width: { type: String, required: true },
    height: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model("Image", imageSchema);
