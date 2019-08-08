#! /usr/bin/env node
const launchChrome = require('./utils/launchHeadlessChrome');
const theme = require('./const/theme');

const chCapturer = require('chrome-har-capturer');
const chalk = require('chalk');
const ora = require('ora');
const argv = require('yargs')
  .options({
    sampleSize: {
      alias       : 'samples',
      description : 'Number of trials for which to ping the target site',
      type        : 'number',
      default     : 5,
    },
    url: {
      description : 'URL under test',
      type        : 'string',
      default     : 'https://example.com',
    },
    printHar: {
      description : 'Print the HAR JSON to stdout',
      type        : 'boolean',
      default     : false,
    },
  })
  .help()
  .alias('help', 'h')
  .argv;

const sampleSize = argv.sampleSize;
const url = argv.url; // TODO make this use a script argument if it's given
const shouldPrintHar = argv.printHar;

const urlsArray = new Array(sampleSize).fill(url);

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

const createSpinnerText = (prettifiedUrl, urlIndex) =>
  `${prettifyUrl(url)} | ${urlIndex}/${sampleSize} completed`;

launchChrome().then(chrome => {
  let allPingsSuccessful = true;
  const prettifiedUrl = prettifyUrl(url);
  const spinnerOptions = {
    text    : createSpinnerText(prettifiedUrl, 0),
    spinner : 'growVertical',
  };
  const spinner = ora(spinnerOptions).start(); // default writes to stderr
  // CHC uses a new browser context for each visit
  // This means the cache will be clear for each visit.
  // We can set the options param to { cache: false } if we want to test speed with caching (which I don't)
  chCapturer.run(urlsArray, {})
    .on('load', url => {})
    .on('done', (url, index) => {
      spinner.text = createSpinnerText(prettifiedUrl, index);
    })
    .on('fail', (url, err) => {
      console.error(chalk.red(`✗\n  ${err.message}`));
      allPingsSuccessful = false;
    })
    .on('har', har => { // This callback triggers when ALL the urls are done processing, with one har file containing all the results.
      har.log.creator = {
        name    : 'Initial Load Benchmarker',
        version : '1.0.0',
        comment : '',
      };
      if (allPingsSuccessful) {
        spinner.succeed(`${createSpinnerText(prettifiedUrl, sampleSize)}. Results:`);
        const generateOutput = require('./process/generateOutput');
        generateOutput(har, shouldPrintHar);
      } else {
        spinner.fail('One or more URL loads failed. Result generation cancelled.');
      }
      process.stderr.write('\n');
      chrome.kill();
    });
});
