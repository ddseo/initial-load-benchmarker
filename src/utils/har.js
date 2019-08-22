const getPagerefsFromHar = har =>
  har.log.pages.map(page => page.id);

const getPagerefToEntries = har => {
  const pagerefToEntries = {};
  getPagerefsFromHar(har).forEach(pageref => {
    pagerefToEntries[pageref] = [];
  });
  har.log.entries.forEach(entry => {
    pagerefToEntries[entry.pageref].push(entry);
  });
  return pagerefToEntries;
};

const getPageFromHar = (pageref, har) =>
  har.log.pages.find(page => page.id === pageref);

const mutateCreator = har => {
  har.log.creator = {
    name    : 'Initial Load Benchmarker',
    version : '1.0.0',
    comment : '',
  };
};

module.exports = {
  getPagerefsFromHar,
  getPagerefToEntries,
  getPageFromHar,
  mutateCreator,
};
