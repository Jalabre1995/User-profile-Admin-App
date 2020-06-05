var createErrror = require('http-errors');
var express = require ('express');
var path = require('path');
var cookieParser = require ('cookie-parser');
var logger = require('morgan');

const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
const authUtils = require('./utils/auth')
const hbs = require('hbs')
const flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')

var app = express();
///Connecting to a particular url////
///We will receive an error if the call back is not going through///
MongoClient.connect('mongodb://localhost',(err, client) =>{
    if(err) {
        throw err
    }
///Passport Set up, settign the parameters when the user logs in////
passport.use(new Strategy(
    (username, password, done) => {
        ///Going to call the users collection using the app.locals.users and use findOne which is a particular Mongodb query to use///
        app.locals.users.findOne({username}, (err, user) =>{
            if(err) {
                return done(err);
            }
            if (!user) {
                ///Once th passport function is done running and runs an error, but there is no user, then return it null, and false.////
                return done(null, false);
            }
            ///When the user does not provide the password that is used and required.///
            if (user.password != authUtils.hashPassword(password)) {
                return done(null, false);
            }
            return done(null,user);

        });
    }
));


///We have serialize the password and store it in the session. Serialize stores the information as text////
passport.serializeUser((user, done) =>{
    done(null, user._id);
});
// 
passport.deserializeUser((id,done) => {
    done(null, {id})
});




///If we don't get an error then we will be refreced to the db///
    const db = client.db('account-app');
    const users = db.collection('users');////giving the db an table ///
    //// Once we have the collection, then it will be saved into the local users.
    app.locals.users = users;
})

//View engine setup//

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false
}));
//Configure the session, passport, flash
app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/// Put some middleware into the root of express////

app.use((req,res,next) =>{
    ////Check if the user is logged in////
    res.locals.loggedIn = req.isAuthenticated();
    next()
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

///Add a new route/////

app.use('/auth', authRouter);
///Catch a 404 to error handler////
app.use(function(req,res,next) {
    next(createErrror(404));
});

//error handler///
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.err = req.app.get('env') === 'development' ? err : {}


/////Retrun the error page////
res.status(err.status || 500);
res.render('error')

})

module.exports = app;