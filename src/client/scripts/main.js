import PollPreviews from './components/pollPreviews';
import axios from 'axios';

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

axios.get('/api/polls/all').then((resp) => {
  const parsedData = resp.data.map(poll => ({
    title: poll.title,
    id: poll._id,
    totalVotes: (function total() {
      let count = 0;
      Object.keys(poll.items).map((key) => {
        count += poll.items[key];
      });
      return count;
    }()),
  }));

  popularPolls.addPolls(parsedData.slice(0, 3));
});

// popularPolls.addPolls([
//   { title: 'test', totalVotes: 5, id: '5a4cd917c98b1d22e5b0a22e' },
//   { title: 'test2', totalVotes: 10, id: '5a4cdb6e83eff923b09eb068' },
//   { title: 'test3', totalVotes: 10, id: '5a4cdc58b397a82856e2f8c8' },
// ]);

// latestPolls.addPolls([
//   { title: 'test', totalVotes: 5, id: '5a4cd917c98b1d22e5b0a22e' },
//   { title: 'test2', totalVotes: 10, id: '5a4cdb6e83eff923b09eb068' },
//   { title: 'test3', totalVotes: 10, id: '5a4cdc58b397a82856e2f8c8' },
// ]);
