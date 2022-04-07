const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        login: { type: String, required: true, unique: true },
        welcomeURL: { type: String, required: true, unique: true },
        isAdmin: { type: Boolean, default: false },
        isHidden: { type: Boolean, default: false },
        isSesjaNarzeczenska: { type: Boolean, default: false },
        isSlub: { type: Boolean, default: false },
        isSesjaSlubna: { type: Boolean, default: false },
        isSesjaOkolicznosciowa: { type: Boolean, default: false },
        isWelcome: { type: Boolean, default: false },
        creationDate: { type: Date, required: true },
        logCounter: { type: Number, required: false },
        images: [{ type: mongoose.Types.ObjectId, required: true, ref: "Image" }],
    },
    {
        collection: "users",
    }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
