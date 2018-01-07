import compression from 'compression';
import zlib from 'zlib';
import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import chalk from 'chalk';
import session from 'express-session';
import mainRoute from './routes';
import apiRoutes from './routes/api';
import fourOfourTemp from './templates/404.js';
import sData from './sData';
import path from 'path';

const compress = compression({
  flush: zlib.Z_PARTIAL_FLUSH,
});

export default class Server {
  constructor(port, dbObject) {
    this._app = express();
    this._app.set('port', process.env.PORT || port);
    this._port = this._app.get('port');
    this._app.use(compress);
    this._db = dbObject;
    this._app.use('/css', express.static(path.resolve(__dirname, '../client/css')));
    this._app.use('/js', express.static(path.resolve(__dirname, '../client/scripts')));

    this._app.set('json spaces', 2);

    this._app.use(session({
      secret: sData['session-secret'],
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    }));

    this._app.use(cookieParser());

    this._app.use(bodyParser.urlencoded({ extended: false }));

    this._app.use(mainRoute);
    this._app.use('/api', apiRoutes);

    this._app.use((req, res) => {
      res.status(404).send(fourOfourTemp());
    });

    this._app.use((err, req, res, next) => {
      res.status(500).send(`An error occured: ${err}`);
    });
  }

  listen() {
    this._app.listen(this._port, () => {
      console.log(`${chalk.bgBlue.bold('[SERVER]:')} 🌍  Server started on port: ${this._port}`);
    });
  }
}
