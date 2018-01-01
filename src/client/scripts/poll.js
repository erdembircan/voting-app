import PollVis from './components/pollVis';

const splitUrl = window.location.href.split('/');
const id = splitUrl[splitUrl.length - 1];

const pollVis = new PollVis(id, .4);

pollVis.draw([50, 30, 15, 5]);
