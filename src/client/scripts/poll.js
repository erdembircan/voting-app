import PollVis from './components/pollVis';
import { setInterval } from 'timers';

const splitUrl = window.location.href.split('/');
const id = splitUrl[splitUrl.length - 1];
const values = [0, 0, 0];

const pollVis = new PollVis(id, {
  donutRadiusMultiplier: 0.4,
  textDistanceMultiplier: 0.8,
  textFontFamily: 'Ubuntu',
  textFontSize: '.8rem',
  colors: _generateColors(values.length),
});

pollVis.draw(values);

setInterval(() => {
  const addIndex = Math.floor(Math.random() * values.length);
  values[addIndex]++;
  pollVis.draw(values);
}, 1000);

function _generateColors(amount) {
  const rand = () => Math.floor(Math.random() * 255);
  const tempArray = [];
  for (let i = 0; i < amount; i++) {
    tempArray.push(`rgb(${rand()},${rand()},${rand()})`);
  }

  return tempArray;
}

// pollVis.draw([1, 2, 3]);
