var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;


///Allow the user to edit their profile////

router.get('/', function(req,res,next) {
    if(!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }
    const users = req.app.locals.users;
    const _id = ObjectID(req.session.passport.user);

    users.findOne({_id}, (err, results) => {
        if(err) {
            throw err;
        }
        res.render('account', {...results});
    });

});
//////////////////////////////////////////////////////////

///Get public profile for any user////
router.get('/"username', (req, res, next) => {
    const users = req.app.locals.users;
    const username = req.params.username;

    users.findOne({username}, (err, results) => {
        if(err || !resutls) {
            res.render('public-profile', {message: {error: ['User not found ']}})
        };
        res.render('public-prifile', {...results, username})
        
    });
    
})
///--------------------------------------------------------------

//Updates profile data////////
router.post('/', (req, res, next) =>{
    if(!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }

    const users = req.app.locals.users;
    const { name, github, twitter, facebook} = req.body;
    const _id = ObjectID(req.session.passport.user);
    users.updateOne({_id}, {$set: {name,githiub, twitter, facebook}}, (err) =>{
        if (err) {
            throw err;
        }
        res.redirect('/users');
    });
});

module.exports = router;
