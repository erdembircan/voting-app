import compression from 'compression';
import zlib from 'zlib';
import express from 'express';
import cookieParser from 'cookie-parser';
import chalk from 'chalk';
import session from 'express-session';
import mainRoute from './routes';
import fourOfourTemp from './templates/404.js';
import sData from './sData';
import config from './config';

const compress = compression({
  flush: zlib.Z_PARTIAL_FLUSH,
});

export default class Server {
  constructor(port, dbObject) {
    this._port = port;
    this._app = express();
    this._app.use(compress);
    this._db = dbObject;
    this._app.use('/css', express.static('../client/css'));
    this._app.use('/js', express.static('../client/scripts'));

    this._app.use(session({
      secret: sData['session-secret'],
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    }));

    this._app.use(cookieParser());

    this._app.use(mainRoute);

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
