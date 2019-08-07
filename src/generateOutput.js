const {
  getPagerefsFromHar,
  getPagerefToEntries,
} = require('./utils/har');
const metricMetas = require('./utils/metricMetas');
const createAverageHar = require('./createAverageHar');
const fs = require('fs');
const chalk = require('chalk');

/**
 * retrieveMetrics
 *
 * parses object sent by api into format we use or
 * parses object format we use into format to send to backend
 *
 * @param {array} metricMetas - array of objects of form
 * { label: string, getMetricForPageref: function(pageref, har, pagerefToEntries)}
 * @param {object} har
 * @param {object} pagerefToEntries
 *
 * @returns {object} metricsData - array of objects of form:
 * {label: string, average: number, stdDeviation: number, values: array[numbers]}
 */
const retrieveMetrics = (metricMetas, har, pagerefToEntries) => {
  const pagerefs = getPagerefsFromHar(har);
  const sampleSize = pagerefs.length;

  return metricMetas.map(({
    label,
    getMetricForPageref,
  }) => {
    const values = pagerefs.map(pageref => getMetricForPageref(pageref, har, pagerefToEntries));
    const sum = values.reduce((a, b) => a + b);
    const avg = sum / sampleSize;
    const squaredDiffSum = values.reduce((a, b) => a + (b - avg) ** 2, 0);
    const stdDeviation = (squaredDiffSum / (sampleSize - 1)) ** 0.5;
    return {
      label,
      values,
      avg,
      stdDeviation,
    };
  });
};

const writeMetricsDataToOutput = (metricsData, output = process.stdout) => {
  const writeWithDashedIndents = (numIndents, stringWithoutNewline) => {
    output.write(`${' '.repeat(2 * numIndents)}${stringWithoutNewline}\n`);
  };

  const printMetricDatum = (label, value) => {
    writeWithDashedIndents(2, `${label.padEnd(5)}: ${value.toFixed(3).toString().padStart(9)}`);
  };

  output.write('RESULTS:\n');
  metricsData.forEach(({
    label,
    values,
    avg,
    stdDeviation,
  }) => {
    writeWithDashedIndents(1, `${label}:`);
    printMetricDatum('avg', avg);
    printMetricDatum('σ', stdDeviation);
    // print values array?
  });
};

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

  createAverageHar(har);

  const metricsData = retrieveMetrics(metricMetas, har, pagerefToEntries);
  writeMetricsDataToOutput(metricsData, output);

  // const createTmpData = require('./createTmpData');
  // createTmpData();
  // create report
  // create avg har
  // zip original har, report, and avg har, and serve it to whichever folder
};

module.exports = generateOutput;
