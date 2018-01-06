import axios from 'axios';
import * as d3 from 'd3';
import PollVis from './components/pollVis';
import { setInterval, setTimeout } from 'timers';
import { generateColors } from '../../server/utils/index';

const splitUrl = window.location.href.split('/');
const id = splitUrl[splitUrl.length - 1];
let colors = [];
let drawn = false;
let busy = false;

const getData = () => {
  axios
    .get(`../api/polls/${id}`)
    .then((resp) => {
      busy = false;
      const values = [];
      const items = [];
      Object.keys(resp.data.items).map((item) => {
        values.push(resp.data.items[item]);
        items.push(item);
      });
      colors = colors.length === 0 ? generateColors(values.length) : colors;
      const pollVis = new PollVis(id, {
        donutRadiusMultiplier: 0.4,
        textDistanceMultiplier: 0.8,
        textFontFamily: 'Ubuntu',
        textFontSize: '.8rem',
        colors,
      });
      pollVis.draw(values);
      drawChart(joinValueColors(values, colors, items), values);
      if (drawn) updateBar(values);
      setTimeout(getData, 1000);
    })
    .catch((err) => {
      console.log(err);
    });
};

getData();

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

function updateBar(values) {
  const bars = document.querySelectorAll('[data-bar]');
  for (let i = 0; i < bars.length; i++) {
    const newWidth = x(values)(values[i]);
    bars[i].style.width = `${newWidth}%`;
    bars[i].textContent = values[i];
  }
}

function drawChart(values, dataValues) {
  if (!drawn) {
    d3
      .select('.chart')
      .selectAll('div')
      .data(values)
      .enter()
      .append('div')
      .on('click', (e) => {
        if (busy) {
          console.log('busy');
          return;
        }
        busy = true;
        axios.post(`/api/vote?id=${id}&item=${e.item}`).then((resp) => {
          window.location.reload();
        });
      })
      .style('text-align', 'left')
      .style('cursor', 'pointer')
      .text(d => `${d.item}`)
      .attr('title', 'click to vote')
      .append('div')
      .style('width', d => `${x(dataValues)(d.value)}%`)
      .style('background-color', d => d.color)
      .text(d => d.value)
      .attr('data-bar', d => d.item)
      .attr('class', 'bar')
      .exit()
      .remove();
    drawn = true;
  }
}
