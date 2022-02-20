var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({ 
    tag: String,
    title: String,
    post: String,
    latest: Boolean,
    time: String,
    date: String,
    image: {
        data: Buffer,
        contentType: String
    }
});
var Post = mongoose.model('Post', postSchema);
module.exports = Post;