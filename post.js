# Devotion-blog
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/dailyblog');

router.get('/addpost', function (req, res, next) {
    var categories = db.get('categories');


    categories.find({},{},function (err, categories){
        res.render('addpost',{
            "title": "Add Post",
            "categories": categories
        });
    });

});
router.post('/addpost', function (req, res, next) {
    //get form values
    var title       = req.body.title;
    var category    = req.body.category;
    var body        = req.body.body;
    var author      = req.body.author;
    var date        = new Date();


    if(req.file){
        console.log('uploading file...');

        var mainImageOriginalName   = req.files.mainimage.originalname;
        var mainImageName           = req.files.mainimage.name;
        var mainImageMime           = req.files.mainimage.mimetype;
        var mainImagePath           = req.files.mainimage.path;
        var mainImageExt            = req.files.mainimage.extension;
        var mainImageSize           = req.files.mainimage.size;
    } else {
        var mainImageName = 'noimage.png';
    }


    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required');

    //check Errors
    var errors = req.validationErrors();

    if (errors){
        res.render('addpost',{
            "errors": errors,
            "title": title,
            "body": body
        });
    }else {
        var posts = db.get('posts');

        //submit to DB
        posts.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainimage

        }, function (err, post) {
            if(err){
                res.send('There was an issue submitting the file');
            }else {
                req.flash('success','post Submitted');
                res.location('/');
                res.redirect('/');
            }
            
        });
    }


});

module.exports = router;
