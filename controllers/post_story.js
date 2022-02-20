const Post = require('../models/post')
const db = require('../config/index').get(process.env.NODE_ENV);

module.exports = {
    post: async (req, res) => {
        var postData = new Post(req.body);
        if (req.body.post) {
            postData.save().then( result => {
                res.status(200).json({id: result._id})
            }).catch(err => {
                res.status(400).json({request: postData.title, error: err});
            });
        } else if (!req.body.title) {
            res.status(406).send({pos: 'title',errmsg:'<div class="error-text">Title Field is Empty!</div>'})
        } else if (!req.body.tag) {
            res.status(406).send({pos: 'tag',errmsg:'<div class="error-text">Tag Field is Empty!</div>'})
        } else if (!req.body.post) {
            res.status(406).send({pos: 'post',errmsg:'<div class="error-text">Blog Post Field is Empty!</div>'})
        }
    }
}
