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

require('./models').connect(sData['mongo-prod']);

const server = new Server(args['server-port']);
server.listen();

setInterval(() => {
  console.log('busy');
}, 5*60*1000);
