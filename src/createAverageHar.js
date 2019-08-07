const {
  getPagerefsFromHar,
  getPagerefToEntries,
} = require('./utils/har');

const createAverageHar = har => { // TODO
  const pagerefs = getPagerefsFromHar(har);
  const pagerefToEntries = getPagerefToEntries(har);
  pagerefs.forEach(pageref => {
    // console.error(pagerefToEntries[pageref].length);
  });
};

module.exports = createAverageHar;
