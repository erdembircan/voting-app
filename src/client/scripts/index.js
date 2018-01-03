import IndexController from './indexController';
import PollPreviews from './components/pollPreviews';
import { setTimeout } from 'timers';

const indexController = new IndexController('#base');

const popularPolls = new PollPreviews('.mainPageWrapper', 'popular polls');
const latestPolls = new PollPreviews('.mainPageWrapper', 'latest polls');

popularPolls.addPolls([
  { title: 'test', totalVotes: 5, id: '5a4cd917c98b1d22e5b0a22e' },
  { title: 'test2', totalVotes: 10, id: '5a4cdb6e83eff923b09eb068' },
  { title: 'test3', totalVotes: 10, id: '5a4cdc58b397a82856e2f8c8' },

]);

latestPolls.addPolls([
  { title: 'test', totalVotes: 5, id: '5a4cd917c98b1d22e5b0a22e' },
  { title: 'test2', totalVotes: 10, id: '5a4cdb6e83eff923b09eb068' },
  { title: 'test3', totalVotes: 10, id: '5a4cdc58b397a82856e2f8c8' },

]);

const messageHolder = document.querySelector('[data-message]');
const errorHolder = document.querySelector('[data-error]');

const { message } = messageHolder.dataset;
const { error } = errorHolder.dataset;

if (message !== '') indexController.showToast(message);
if (error !== '') indexController.showToast(error);
