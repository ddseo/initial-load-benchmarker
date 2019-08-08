const { parse } = require('url');

const createOutputFileName = (url, documentTypeLabel) => {
  const urlHost = parse(url).host;
  const epochTime = new Date().getTime();
  return `${urlHost}-${documentTypeLabel}-${epochTime}.har`;
};

module.exports = createOutputFileName;
