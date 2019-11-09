var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/home');
var UserRole = require('../app/models/userRole');
var bcrypt = require('bcrypt-nodejs');

var configAuth = require('./auth.js');
var constant = require('../config/constants');
var dateFormat = require('dateformat');
var fs = require('fs');

var bcrypt = require('bcrypt-nodejs');


//expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            process.nextTick(function() {

                        User.find().sort([
                            ['_id', 'descending']
                        ]).exec(function(err, userdata) {

                         UserRole.find().sort([
                            ['_id', 'descending']
                        ]).exec(function(err, userRoledata) {

                            // if there is no user with that email
                            // create the user

                            var newUser = new User();
                            var userRole = new UserRole();

                            console.log("*****userdata*********: ", userdata);
                             console.log("*****userRoledata*********: ", userRoledata)
                            if (userdata.length == 0) {
                                var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

                                var active_code = bcrypt.hashSync(Math.floor((Math.random() * 99999999) * 54), null, null);


                                newUser.mail = email;
                                newUser.password = newUser.generateHash(password);
                                newUser.name = req.body.username;
                                newUser.created_date = day;
                                newUser.updated_date = day;
                                newUser.status = 'active'; //inactive for email actiavators
                                newUser.active_hash = active_code;
                                newUser._id = 1;
                                userRole._id = 1;
                                userRole.user_id = 1;
                                userRole.role = 'admin';
                                userRole.status = 'active';
                                userRole.created_date = day;
                                userRole.updated_date = day;


                                userRole.save(function(err) {
                                    if (err)
                                        throw err;
                                    newUser.save(function(err) {
                                        if (err)
                                            throw err;
                                        return done(null, 'AdminUser Created Successfully');
                                    });
                                })

                            } else {
                                console.log("sendCond email:")
                                var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

                                var active_code = bcrypt.hashSync(Math.floor((Math.random() * 99999999) * 54), null, null);


                                newUser.mail = email;
                                newUser.password = newUser.generateHash(password);
                                newUser.name = req.body.username;
                                newUser.created_date = day;
                                newUser.updated_date = day;
                                newUser.status = 'active'; //inactive for email actiavators
                                newUser.active_hash = active_code;
                                newUser._id = userdata[0]._id + 1;
                                userRole._id = userdata[0]._id + 1;
                                userRole.user_id = userdata[0]._id + 1;
                                userRole.role = 'user';
                                userRole.status = 'active';
                                userRole.created_date = day;
                                userRole.updated_date = day;

                                userRole.save(function(err) {
                                    if (err)
                                        throw err;
                                    newUser.save(function(err) {
                                        if (err)
                                            throw err;

                                        return done(null, 'User created Successfully........');

                                        // req.session.destroy();

                                    });
                                })

                            }


                        });


                   // }

               });

            });


        }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form



            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'mail': email
            }, function(err, user) {
                // if there are any errors, return the error before anything else

                if (err)
                    return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash


                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.')); // req.flash is the way to set flashdata using connect-flash



                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('error', 'Email and Password Does Not Match.')); // create the loginMessage and save it to session as flashdata

                if (user.status === 'inactive')
                    return done(null, false, req.flash('error', 'Your Account Not Activated ,Please Check Your Email')); // create the loginMessage and save it to session as flashdata


                // all is well, return successful user
                req.session.user = user;

                return done(null, user);
            });

        }));

};