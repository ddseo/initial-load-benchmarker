const fs = require('fs');
const {
  getPagerefsFromHar,
  getPagerefToEntries,
} = require('../utils/har');
const metricMetas = require('../utils/metricMetas');
const {
  createBuildDirName,
  createOutputFileName,
  ensureDirExists,
} = require('../utils/files');
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

  const buildDirParentPath = './build';
  const buildDirPath = `${buildDirParentPath}/${createBuildDirName(url)}`;
  ensureDirExists(buildDirPath);

  const harJSON = JSON.stringify(har, null, 4);
  if (shouldPrintHar) {
    output.write(harJSON);
    output.write('\n');
  }
  const harFileName = createOutputFileName(url, 'HAR', 'har');
  // TODO change this to async if there's any meaninful parallel processing to do
  fs.writeFileSync(`${buildDirPath}/${harFileName}`, harJSON, err => {
    if (err) throw err;
  });

  const metricsData = retrieveMetrics(metricMetas, har, pagerefToEntries);
  writeMetricsDataToOutput(metricsData, output);
  createCharts(metricsData, buildDirPath, url);
  console.error(`>> Results exported to "${buildDirPath}/"`);
};

module.exports = generateOutput;
