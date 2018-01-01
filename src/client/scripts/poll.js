import axios from 'axios';
import PollVis from './components/pollVis';
import { setInterval } from 'timers';
import { generateColors } from '../../server/utils/index';

const splitUrl = window.location.href.split('/');
const id = splitUrl[splitUrl.length - 1];

axios
  .get(`../api/polls/${id}`)
  .then((resp) => {
    const values = [];
    Object.keys(resp.data.items).map((item) => {
      values.push(resp.data.items[item]);
      const pollVis = new PollVis(id, {
        donutRadiusMultiplier: 0.4,
        textDistanceMultiplier: 0.8,
        textFontFamily: 'Ubuntu',
        textFontSize: '.8rem',
        colors: generateColors(values.length),
      });

      pollVis.draw(values);
    });
  })
  .catch((err) => {
    console.log(err);
  });
