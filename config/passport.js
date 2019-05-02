const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../api/models/user');

module.exports = passport => {
    /** @region_snippet_Serialize */
    passport.serializeUser((user, done) => done(null, user.id));

    /** @region_snippet_Deserialize */
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    });
    /** @endregion */

    /** @region_snippet_LocalSignupStrategy */
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (request, email, password, done) => {
        User.findOne({ email }, (error, user) => {
            if (error) {
                return done(error)
            }

            if (user) {
                return done(null, false, request.flash('signupMessage', 'That email is already taken.'));
            }
            else {
                var newUser = new User();

                newUser.fullName = request.body.fullName;
                newUser.email = request.body.email;
                newUser.hash_password = bcrypt.hashSync(request.body.password, 10);

                newUser.save(error => {
                    if (error) {
                        throw error;
                    }

                    return done(null, newUser);
                });
            }
        });
    }));
    /** @endregion */

    /** @region_snippet_LocalLoginStrategy */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (request, email, password, done) => {
        User.findOne({ email }, (error, user) => {
            if (error) {
                return done(error);
            }

            if (!user) {
                return done(null, false, request.flash('loginMessage', 'No user found.'));
            }

            if (!user.comparePassword(request.body.password)) {
                return done(null, false, request.flash('loginMessage', 'Oops wrong password.'));
            }

            return done(null, user);
        });
    }));
    /** @endregion */
};