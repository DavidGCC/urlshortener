const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("mongoose-type-url");

const UrlSchema = new mongoose.Schema({
    url: mongoose.SchemaTypes.Url,
    shortenedHash: { type: String, unique: true }
});

UrlSchema.plugin(uniqueValidator);

UrlSchema.set("toJSON", {
    transform: (doc, returned) => {
        returned.id = returned._id.toString()
        delete returned._id;
        delete returned.__v;
    }
});

module.exports = mongoose.model("Url", UrlSchema);
