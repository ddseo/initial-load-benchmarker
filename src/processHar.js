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

const getPagerefToLoadTime = (har, pagerefToEntries) => {
  const pagerefToLoadTime = {};
  har.log.pages.forEach(page => {
    const entries = pagerefToEntries[page.id];
    const startTime = page.startedDateTime;
    let maxLoadFinishTime = -1;

    entries.forEach(entry => {
      const currLoadFinishTime = new Date(entry.startedDateTime);
      currLoadFinishTime.setMilliseconds(currLoadFinishTime.getMilliseconds() + entry.time);
      maxLoadFinishTime = currLoadFinishTime > maxLoadFinishTime ? currLoadFinishTime : maxLoadFinishTime;
    });

    pagerefToLoadTime[page.id] = maxLoadFinishTime - startTime;
  });

  return pagerefToLoadTime;
};

const processHar = har => {
  const pagerefs = har.log.pages.map(page => page.id);
  const pagerefToEntries = getPagerefToEntries(har, pagerefs);
  const pagerefToLoadTime = getPagerefToLoadTime(har, pagerefToEntries);
  const json = JSON.stringify(har, null, 4);
  const output = process.stdout;
  output.write(json);
  output.write('\n');
  let counter = 0;
  Object.keys(pagerefToLoadTime).forEach(pageref => {
    output.write(`sample ${counter++}: ${pagerefToLoadTime[pageref]} ms\n`);
  });
  output.write('\n');
};

module.exports = processHar;
