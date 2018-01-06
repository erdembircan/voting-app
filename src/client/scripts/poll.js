import axios from 'axios';
import * as d3 from 'd3';
import PollVis from './components/pollVis';
import { setInterval } from 'timers';
import { generateColors } from '../../server/utils/index';

const splitUrl = window.location.href.split('/');
const id = splitUrl[splitUrl.length - 1];

axios
  .get(`../api/polls/${id}`)
  .then((resp) => {
    console.log(resp);
    const values = [];
    const items = [];
    Object.keys(resp.data.items).map((item) => {
      values.push(resp.data.items[item]);
      items.push(item);
    });
    const colors = generateColors(values.length);
    const pollVis = new PollVis(id, {
      donutRadiusMultiplier: 0.4,
      textDistanceMultiplier: 0.8,
      textFontFamily: 'Ubuntu',
      textFontSize: '.8rem',
      colors,
    });
    pollVis.draw(values);
    drawChart(joinValueColors(values, colors, items), values);
  })
  .catch((err) => {
    console.log(err);
  });

function joinValueColors(values, colors, items) {
  const tempArray = [];

  for (let i = 0; i < values.length; i++) {
    tempArray.push({ value: values[i], color: colors[i], item: items[i] });
  }
  return tempArray;
}

const x = data =>
  d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, 100]);

function drawChart(values, dataValues) {
  d3
    .select('.chart')
    .selectAll('div')
    .data(values)
    .enter()
    .append('div')
    .style('text-align', 'left')
    .text(d => d.item)
    .append('div')
    // .style('width', d => `${d.value * 20}px`)
    .style('width', d => `${x(dataValues)(d.value)}%`)
    .style('background-color', d => d.color)
    .text(d => d.value);
}
