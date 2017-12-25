import minimist from 'minimist';
import Server from './server';
import config from './config';
// import { connect } from './models';

const args = minimist(process.argv, {
  default: {
    'server-port': config['server-port'],
  },
});

require('./models').connect(config.mongodbURL);

const server = new Server(args['server-port']);
server.listen();
