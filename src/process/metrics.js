const {
  getPagerefsFromHar,
} = require('../utils/har');

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

module.exports = {
  retrieveMetrics,
  writeMetricsDataToOutput,
};
