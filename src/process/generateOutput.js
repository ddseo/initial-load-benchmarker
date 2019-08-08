const fs = require('fs');
const {
  getPagerefsFromHar,
  getPagerefToEntries,
} = require('../utils/har');
const metricMetas = require('../utils/metricMetas');
const {
  retrieveMetrics,
  writeMetricsDataToOutput,
} = require('./metrics');
// const createAverageHar = require('./createAverageHar');

const createHarFileName = har => {
  const url = har.log.pages[0].title;
  const { parse } = require('url');
  const urlHost = parse(url).host;
  const epochTime = new Date().getTime();
  return `${urlHost}-HAR-${epochTime}.har`;
};

const generateOutput = (har, shouldPrintHar) => {
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
  const harFileName = createHarFileName(har);
  // TODO change this to async if there's any meaninful parallel processing to do
  fs.writeFileSync(`${buildDirPath}/${harFileName}`, harJSON, err => {
    if (err) throw err;
  });

  // createAverageHar(har);

  const metricsData = retrieveMetrics(metricMetas, har, pagerefToEntries);
  writeMetricsDataToOutput(metricsData, output);

  // const createTmpData = require('../createTmpData');
  // createTmpData();
  // create report
  // create avg har
  // zip original har, report, and avg har, and serve it to whichever folder
};

module.exports = generateOutput;
