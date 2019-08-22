const ora = require('ora');
const chalk = require('chalk');

const prettifyUrl = url => {
  try {
    const { parse, format } = require('url');
    const urlObject = parse(url);
    urlObject.protocol = chalk.gray(urlObject.protocol.slice(0, -1));
    urlObject.host = chalk.bold(urlObject.host);
    return format(urlObject).replace(/[:/?=#]/g, chalk.gray('$&'));
  } catch (err) {
    // invalid URL delegate error detection
    return url;
  }
};

const createSpinnerText = (prettifiedUrl, urlIndex, sampleSize) =>
  `${prettifiedUrl} | ${urlIndex}/${sampleSize} completed`;

const getSpinner = (url, sampleSize) => {
  const spinnerOptions = {
    text    : createSpinnerText(prettifyUrl(url), 0),
    spinner : 'growVertical',
  };
  return ora(spinnerOptions).start();
};

module.exports = {
  prettifyUrl,
  createSpinnerText,
  getSpinner,
};
