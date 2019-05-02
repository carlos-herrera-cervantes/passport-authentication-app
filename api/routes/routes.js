const routes = (app, passport) => {
    /**
     * @GET
     */
    
    /** @region_snippet_Index */
    app.get('/', (request, response) => response.render('index.ejs'));

    /** @region_snippet_Login */
    app.get('/login', (request, response) => response.render('login.ejs', { message: request.flash('loginMessage') }));

    /** @region_snippet_Signup */
    app.get('/signup', (request, response) => response.render('signup.ejs', { message: request.flash('signupMessage') }));

    /** @region_snippet_Profile */
    app.get('/profile', isLoggedIn, (request, response) => response.render('profile.ejs', { user: request.user }));

    /** @region_snippet_Logout */
    app.get('/logout', (request, response) => {
        request.logout();
        response.redirect('/');
    });

    /**
     * @POST
     */

    /** @region_snippet_Login */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: 'login',
        failureFlash: true
    }), (request, response) => {
        console.log('hello');
        if (request.body.remember) {
            request.session.cookie.maxAge = 1000 * 60 * 3;
        }
        else {
            request.session.cookie.expires = false;
        }

        response.redirect('/');
    });
    /** @endregion */
    
    /** @region_snippet_Signup */
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    /** @endregion */
};

/**
 * @HELPERS
 */

/** @region_snippet_IsUser */
const isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }

    response.redirect('/');
};
/** @endregion */

module.exports = routes;