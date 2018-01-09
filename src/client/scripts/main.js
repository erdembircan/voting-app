import PollPreviews from './components/pollPreviews';
import axios from 'axios';
import DemoPoll from './components/demoPoll';

document.querySelectorAll('#popUp').forEach((item) => {
  item.addEventListener('click', (e) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const popUpWidth = 600;
    const popUpHeight = 300;
    window.open(
      '/login',
      'Sign in with Twitter',
      `width=${popUpWidth},height=${popUpHeight}, top=${(windowHeight - popUpHeight) /
        2}, left=${(windowWidth - popUpWidth) / 2}`,
    );
    return false;
  });
});

const popularPolls = new PollPreviews('.mainPageWrapper', 'popular polls');
const latestPolls = new PollPreviews('.mainPageWrapper', 'latest polls');

axios.get('/api/polls?type=latest&limit=5').then((resp) => {
  const parsedData = resp.data.map(poll => ({
    title: poll.title,
    id: poll._id,
    totalVotes: (function total() {
      let count = 0;
      if (poll.items) {
        Object.keys(poll.items).map((key) => {
          count += poll.items[key];
        });
        return count;
      }
    }()),
  }));

  latestPolls.addPolls(parsedData);
});

axios.get('/api/polls?type=top&limit=5').then((resp) => {
  const parsedData = resp.data.map(poll => ({
    title: poll.title,
    id: poll._id,
    totalVotes: (function total() {
      let count = 0;
      if (poll.items) {
        Object.keys(poll.items).map((key) => {
          count += poll.items[key];
        });
        return count;
      }
    }()),
  }));

  popularPolls.addPolls(parsedData);
});

const demoPoll = new DemoPoll(5, 'demo');
const demoPoll2 = new DemoPoll(4, 'demo2');
const demoPoll3 = new DemoPoll(3, 'demo3');
demoPoll.start();
demoPoll2.start();
demoPoll3.start();
