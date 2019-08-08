const fs = require('fs');
const {
  getPagerefsFromHar,
  getPagerefToEntries,
} = require('../utils/har');
const metricMetas = require('../utils/metricMetas');
const createOutputFileName = require('../utils/createOutputFileName');
const {
  retrieveMetrics,
  writeMetricsDataToOutput,
} = require('./metrics');
const { createCharts } = require('./infographics');

const generateOutput = (har, shouldPrintHar) => {
  const url = har.log.pages[0].title;
  const pagerefs = getPagerefsFromHar(har);
  const pagerefToEntries = getPagerefToEntries(har, pagerefs);
  const output = process.stdout;

  const harJSON = JSON.stringify(har, null, 4);
  if (shouldPrintHar) {
    output.write(harJSON);
    output.write('\n');
  }

  const buildDirPath = './build';
  fs.mkdir(buildDirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const harFileName = createOutputFileName(url, 'HAR');
  // TODO change this to async if there's any meaninful parallel processing to do
  fs.writeFileSync(`${buildDirPath}/${harFileName}`, harJSON, err => {
    if (err) throw err;
  });

  const metricsData = retrieveMetrics(metricMetas, har, pagerefToEntries);
  writeMetricsDataToOutput(metricsData, output);
  createCharts(metricsData);
};

module.exports = generateOutput;
