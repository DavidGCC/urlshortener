const mongoose = require("mongoose");
require("mongoose-type-url");

const UrlSchema = new mongoose.Schema({
    shortenedUrl: mongoose.SchemaTypes.Url,
    url: mongoose.SchemaTypes.Url,
});

UrlSchema.set("toJSON", {
    transform: (doc, returned) => {
        returned.id = returned._id.toString()
        delete returned._id;
        delete returned.__v;
    }
});

module.exports = mongoose.model("Url", UrlSchema);
