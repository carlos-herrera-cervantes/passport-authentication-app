require('./config/db');

const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');

const routes = require('./api/routes/routes');

/**
 * @CONFIG
 */
const port = process.env.PORT || 3000;
const app = express();

/**
 * @MIDDLEWARES
 */
app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

/**
 * @END_POINTS
 */
routes(app, passport);

/** @LISTEN */ 
app.listen(port, () => {
    console.log(chalk.blue.inverse(`Server running at http://localhost:${port}`));
})
