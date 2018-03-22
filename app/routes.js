
module.exports = function(app, passport) {
 // Home Page

    app.get('/', function(req,res){
        res.render('index.ejs');
    });

    // Login Page
    app.get('/login', function(req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    // Signup Page
    app.get('/signup', function(req, res){
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // Profile Page
    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', {
            user: req.user // Get user from session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
