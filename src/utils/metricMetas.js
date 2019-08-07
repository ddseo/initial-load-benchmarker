const {
  getPageFromHar,
} = require('./har');

module.exports = [
  {
    label               : 'Network Load time',
    getMetricForPageref : (pageref, har, pagerefToEntries) => {
      const entries = pagerefToEntries[pageref];
      const page = getPageFromHar(pageref, har);
      const startTime = new Date(page.startedDateTime);
      let maxLoadFinishTime = -1;

      entries.forEach(entry => {
        const currLoadFinishTime = new Date(entry.startedDateTime);
        currLoadFinishTime.setMilliseconds(currLoadFinishTime.getMilliseconds() + entry.time);
        maxLoadFinishTime = currLoadFinishTime > maxLoadFinishTime ? currLoadFinishTime : maxLoadFinishTime;
      });

      return maxLoadFinishTime - startTime;
    },
  },
  {
    label               : 'DOMContentLoaded time',
    getMetricForPageref : (pageref, har, pagerefToEntries) => {
      const page = getPageFromHar(pageref, har);
      return page.pageTimings.onContentLoad;
    },
  },
];
