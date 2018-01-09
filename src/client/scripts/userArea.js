import PollPreview from './components/pollPreviews';

const userPolls = new PollPreview('.mainPageWrapper', 'your polls');
const pollDataHTML = document.querySelector('div [data-polls]');
const pollData = JSON.parse(pollDataHTML.dataset.polls).array;

userPolls.addPolls(pollData);
