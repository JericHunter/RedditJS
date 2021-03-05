const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require("../util/autopopulate");
const PostSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true },
    subreddit: { type: String,  required: true }
});

// Always populate the author field
PostSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Post", PostSchema);

module.exports = mongoose.model('Post', PostSchema);
