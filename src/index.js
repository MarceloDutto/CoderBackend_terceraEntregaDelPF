import express from 'express';
import passport from 'passport';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import __dirname from './utils.js';
import config from './config/index.js';
import initializePassport from './config/passport.js';
import router from './router/index.js';
import addLogger from './middlewares/logger.middleware.js';

const app = express();
const port = config.app.port;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
/* app.use(morgan('dev')); */
app.use(addLogger);
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

router(app);

export { app, port };