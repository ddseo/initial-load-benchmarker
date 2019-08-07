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

module.exports = {
  getPagerefsFromHar,
  getPagerefToEntries,
  getPageFromHar,
};
