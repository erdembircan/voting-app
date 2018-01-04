import PollVis from '../components/pollVis';
import { generateColors } from '../../../server/utils/index';

export default class DemoPoll {
  constructor(valueAmount, canvasId, updateInterval = 1000) {
    this._demoValues = this._fillArray(valueAmount, 0);
    this._interval = updateInterval;

    this._demoPoll = new PollVis(canvasId, {
      donutRadiusMultiplier: 0.4,
      textDistanceMultiplier: 0.8,
      textFontFamily: 'Ubuntu',
      textFontSize: '.6rem',
      colors: generateColors(this._demoValues.length),
    });
  }

  _fillArray(length,item){
    const tempArray = Array.apply(null, Array(length));
    return tempArray.map(temp => item);
  }

  start() {
    setInterval(() => {
      const indexToAdd = Math.floor(Math.random() * this._demoValues.length);
      this._demoValues[indexToAdd]++;
      this._demoPoll.draw(this._demoValues);
    }, 1000);
  }
}
