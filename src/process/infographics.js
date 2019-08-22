const D3Node = require('d3-node');
const fs = require('fs');
const svg2png = require('svg2png');
const {
  createOutputFileName,
} = require('../utils/files');

const createCharts = (metricsData, buildDirPath, url) => {
  const networkResponseTimeFileName = createOutputFileName(url, 'network-load-graph', 'png');
  generateHistogram(metricsData[0].values, `${buildDirPath}/${networkResponseTimeFileName}`);
};

const generateHistogram = (data, filePath) => {
  const d3n = new D3Node();
  const d3 = d3n.d3;

  const margin = { top: 10, right: 30, bottom: 30, left: 40 };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const numberOfBins = Math.max(Math.floor(data.length * 0.6), 10); // this is fairly arbitrary - just used something that looks good

  const svg = d3n.createSVG(width + margin.left + margin.right, height + margin.top + margin.bottom)
    .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const x = d3.scaleLinear()
    .domain([0, d3.max(data) * 1.1])
    .range([0, width]);
  // x axis
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  const histogram = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(numberOfBins));

  const bins = histogram(data);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([height, 0]);
  // y axis
  svg.append('g')
    .call(d3.axisLeft(y));

  svg.selectAll('rect')
    .data(bins)
    .enter()
    .append('rect')
    .attr('x', 1)
    .attr('transform', d => 'translate(' + x(d.x0) + ',' + y(d.length) + ')')
    .attr('width', d => x(d.x1) - x(d.x0) - 1)
    .attr('height', d => height - y(d.length))
    .style('fill', 'steelblue'); // Use steelblue because it sounds cool

  const svgBuffer = Buffer.from(d3n.svgString(), 'utf-8');
  svg2png(svgBuffer)
    .then(buffer => fs.writeFileSync(filePath, buffer))
    .catch(e => console.error('ERR:', e));
};

module.exports = {
  createCharts,
};
