const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
var cookieParser = require('cookie-parser');
router.use(cookieParser());
const express = require('express');
const app = express();
const reqs = require('../controllers/reqs')
const post = require('../controllers/post_story')
const multer = require("multer");
const PATH = 'public';
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg'));
        }
    }
});

router
    .get("/", reqs.getHome)
    .get("/posts", reqs.getPosts)
    .post('/addpost', post.post)
    .post('/addpostimage/:_id', upload.single('myfile'), (req, res) => {        
        var imgId = req.params._id.replace(/:/g, ''),
        oldFileExt = req.body.filename.split('.').pop();
        fs.rename(`./public/uploads/${req.body.filename}`, `./public/uploads/${imgId}.${oldFileExt}`, function read(err, newName) {
            if (err) {
                res.status(501).send({error: `file name not changed`})
            } else {
                res.status(200).send({newName: `${imgId}.${oldFileExt}`})
            }
        });        
    })
    .get("/admin", (req,res) => {
        res.render('admin', {title: 'Admin Area'})
    }).get("/main", (req,res) => {
        res.render('blog_', {title: 'blog'})
    })
    .get('/blog/:_id', reqs.getBlog)

module.exports = router;