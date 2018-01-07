import minimist from 'minimist';
import Server from './server';
import config from './config';
import sData from './sData';
import { setInterval } from 'timers';

const args = minimist(process.argv, {
  default: {
    'server-port': config['server-port'],
  },
});

const dbUri = process.env.NODE_ENV === 'production' ? sData['mongo-prod'] : sData['mongo-dev'];

require('./models').connect(dbUri);

const server = new Server(args['server-port']);
server.listen();
