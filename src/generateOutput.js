'use strict';

// So for each ping:
// - parse the har file to get the data points (time for all network reqs to complete)
// - put the data into whichever format and generate whatever infographics
// - export the .har

const getPagerefToEntries = (har, pagerefs) => {
  const pagerefToEntries = {};
  pagerefs.forEach(pageref => {
    pagerefToEntries[pageref] = [];
  });
  har.log.entries.forEach(entry => {
    pagerefToEntries[entry.pageref].push(entry);
  });
  return pagerefToEntries;
};

const getPagerefToNetworkLoadTime = (har, pagerefToEntries) => {
  const pagerefToNetworkLoadTime = {};
  har.log.pages.forEach(page => {
    const entries = pagerefToEntries[page.id];
    const startTime = new Date(page.startedDateTime);
    let maxLoadFinishTime = -1;

    entries.forEach(entry => {
      const currLoadFinishTime = new Date(entry.startedDateTime);
      currLoadFinishTime.setMilliseconds(currLoadFinishTime.getMilliseconds() + entry.time);
      maxLoadFinishTime = currLoadFinishTime > maxLoadFinishTime ? currLoadFinishTime : maxLoadFinishTime;
    });

    pagerefToNetworkLoadTime[page.id] = maxLoadFinishTime - startTime;
  });

  return pagerefToNetworkLoadTime;
};

const generateOutput = har => {
  const pagerefs = har.log.pages.map(page => page.id);
  const pagerefToEntries = getPagerefToEntries(har, pagerefs);
  const pagerefToNetworkLoadTime = getPagerefToNetworkLoadTime(har, pagerefToEntries);
  const json = JSON.stringify(har, null, 4);
  const output = process.stdout;
  // output.write(json);
  // output.write('\n');
  let counter = 0;
  let networkLoadTimeSum = 0;
  Object.keys(pagerefToNetworkLoadTime).forEach(pageref => {
    networkLoadTimeSum += pagerefToNetworkLoadTime[pageref];
    output.write(`sample ${counter++}: ${pagerefToNetworkLoadTime[pageref]} ms\n`);
  });

  const averageNetworkLoadTime = networkLoadTimeSum / counter;
  output.write(`average: ${averageNetworkLoadTime}\n`);

  let squaredDiffSum = 0;
  Object.keys(pagerefToNetworkLoadTime).forEach(pageref => {
    squaredDiffSum += (pagerefToNetworkLoadTime[pageref] - averageNetworkLoadTime) ** 2;
  });
  const stdDeviation = (squaredDiffSum / (counter - 1)) ** 0.5;
  output.write(`σ: ${stdDeviation}`);

  const createTmpData = require('./createTmpData');
  createTmpData(pagerefToNetworkLoadTime);
  // create report
  // create avg har
  // zip original har, report, and avg har, and serve it to whichever folder
};

module.exports = generateOutput;
