import PollPreview from './components/pollPreviews';
import axios from 'axios';

const userPolls = new PollPreview('.mainPageWrapper', 'your polls', {
  head: '<th>delete</th>',
});
const pollDataHTML = document.querySelector('div [data-polls]');
const pollData = JSON.parse(pollDataHTML.dataset.polls).array;

userPolls.addPolls(pollData);

const deleteButtons = Array.from(document.querySelectorAll('.red'));

deleteButtons.map((button) => {
  button.addEventListener(
    'click',
    (e) => {
      const targetButton = e.target;
      targetButton.disabled = true;
      const pollId = targetButton.dataset.id;
      axios
        .post(`/api/deletePoll?id=${pollId}`)
        .then((resp) => {
          console.log('ok');
          targetButton.disabled = false;
          window.location.reload();
        })
        .catch((err) => {
          window.location.reload();
        });

      e.stopPropagation();
    },
    true,
  );
});
