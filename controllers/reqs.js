const Post = require('../models/post')
const db = require('../config/index').get(process.env.NODE_ENV);

module.exports = {
    getHome: async (req, res) => {
        Post.find({latest: true}, (err, latest_post) => {      
            Post.find({}, (err, posts) => {
                res.render('blog_', { 
                    title: 'Oprofinder Blog',
                    posts: posts,
                    latest_post: latest_post
                })
            });
        })
    },
    getPosts: async (req, res) => {
        Post.find({}, (err, posts) => {
            res.status(200).send({ 
                posts: posts
            })
        });
    },
    getBlog: async (req, res) => {
        Post.find({_id: req.params._id}, (err, post) => {
            if (err) {
                res.status(404).send('Post Not Found')
            } else {
                res.status(200).render('blog', {
                    title: post[0].title,
                    post_title: post[0].title,
                    post_body: post[0].post
                })
            }
        })
    }
}
