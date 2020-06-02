/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Passport configuration middleware
 * ==========
 */
const ciMode = process.env.NODE_ENV === 'ci';

// eslint-disable-next-line import/no-extraneous-dependencies
const parser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const passport = require('passport');
const AuthStrategy = ciMode ?
    require('passport-mocked').Strategy :
    require('passport-google-oauth20').Strategy;

// User model
const User = require('../models/User');

/**
 * Apply passport authentication config to router
 * @function
 * @param {express.Router} router - express Router instance to enable for.
 *
 */
const Passport = router => {
    const bodyParser = parser;
    const strategy = new AuthStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.AUTH_CALLBACK_URL,
            passReqToCallback: true,
        },
        (request, accessToken, refreshToken, profile, done) => {
            // Verify user allowed
            const email = ciMode ? process.env.DEV_EMAIL : profile.emails[0].value;
            User.findOne({
                    email,
                },
                (err, user) => {
                    if (err) {
                        global.logger.error(`Login error: ${err}`);
                        return done(err);
                    }
                    if (!user) {
                        global.logger.error(
                            `Login error: user not found for email ${profile.emails[0].value}`
                        );
                        return done(err);
                    }
                    return done(err, user);
                }
            );
        }
    );

    // Session store (mongostore for prod)
    if (process.env.NODE_ENV === 'development') {
        router.use(
            session({
                secret: process.env.SESSION_COOKIE,
                resave: true,
                saveUninitialized: false,
            })
        );
    } else {
        const mongooseConnection = mongoose.connections[0];
        router.use(
            session({
                saveUninitialized: false,
                resave: false,
                secret: process.env.SESSION_COOKIE,
                store: new MongoStore({
                    mongooseConnection,
                }),
            })
        );
    }

    /**
     * Google oauth2/passport config
     */
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(strategy);

    // Support json encoded bodies
    router.use(bodyParser.json());

    // Support encoded bodies
    router.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    // Set router to use passport
    router.use(passport.initialize());
    router.use(passport.session());
};

module.exports = Passport;