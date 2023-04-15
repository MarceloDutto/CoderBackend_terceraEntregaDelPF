import express from 'express';
import morgan from 'morgan';
import config from './config/index.js';
import __dirname from './utils.js';
import router from './router/index.js';

const app = express();
const port = config.app.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

router(app);

export { app, port };