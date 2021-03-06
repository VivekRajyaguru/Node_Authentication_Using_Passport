
var localStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var User = require('../app/model/user');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your@gmail.com',
      pass: 'password'
    }
  });

module.exports = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.findOne({'local.email': email}, function(err, user){
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Email is Already Taken.'))
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    var mailOptions = {
                        from: 'your@gmail.com',
                        to: email,
                        subject: 'Demo Email From Node',
                        text: 'Yo!'
                      };
                      
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
                    newUser.save(function(err){
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            })

        });
    }
    ));

    passport.use('local-login', new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, user);
        });

    }));
};