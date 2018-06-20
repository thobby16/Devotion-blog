# Devotion-blog
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/dailyblog');



router.get('/addcategory', function(req, res, next) {
    res.render('addcategory',{
        "title": "Add Category"
    });
});

router.post('/addcategory', function (req, res, next) {
    //get form values
    var title       = req.body.title;

    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();


    //check Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory',{
            "errors": errors,
            "title": title
        });
    }else {
        var categories = db.get('categories');

        //submit to DB
        categories.insert({
            "title": title
        }, function (err, category){
            if(err){
                res.send('There was an issue submitting the file');
            }else {
                req.flash('success','Category Submitted');
                res.location('/');
                res.redirect('/');
            }

        });
    }


});


module.exports = router;
