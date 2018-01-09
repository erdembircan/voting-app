import pollPreviews from '../../../server/templates/partials/pollPreview.hbs';
import pollSummary from '../../../server/templates/partials/pollSummary.hbs';
import parseHtml from '../util/parseHtml';
import PollVis from '../components/pollVis';
import { generateColors } from '../../../server/utils/index';
import axios from 'axios';

class PollPreviews {
  constructor(container, message, options = { addDelete: false }) {
    this._baseContainer = document.querySelector(container);
    this._container = parseHtml(pollPreviews({ pollMessage: message })).firstChild;
    this._pollList = this._container.querySelector('.tableBody');
    this._baseContainer.appendChild(this._container);
  }

  addPolls(data) {
    data.map((item) => {
      const poll = pollSummary({
        title: item.title,
        totalVotes: item.totalVotes,
        id: item.id,
      });

      const parsed = parseHtml(poll, this._pollList).firstChild;

      this._pollList.appendChild(parsed);

      axios
        .get(`../api/polls/${item.id}`)
        .then((resp) => {
          const values = [];
          Object.keys(resp.data.items).map((item) => {
            values.push(resp.data.items[item]);
          });
          const canvas = parsed.querySelector('canvas');
          const pollVis = new PollVis(canvas, {
            donutRadiusMultiplier: 0.4,
            textDistanceMultiplier: 0.8,
            textFontFamily: 'Ubuntu',
            textFontSize: '0rem',
            colors: generateColors(values.length),
          });

          pollVis.draw(values);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}

export default PollPreviews;
