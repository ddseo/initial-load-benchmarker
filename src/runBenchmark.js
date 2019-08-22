#! /usr/bin/env node
const launchChrome = require('./utils/launchHeadlessChrome');
const {
  mutateCreator,
} = require('./utils/har');
const {
  prettifyUrl,
  createSpinnerText,
  getSpinner,
} = require('./utils/formatting');

const chCapturer = require('chrome-har-capturer');
const chalk = require('chalk');
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
const url = argv.url;
const shouldPrintHar = argv.printHar;

const prettifiedUrl = prettifyUrl(url);
const urlsArray = new Array(sampleSize).fill(url);

launchChrome().then(chrome => {
  let allPingsSuccessful = true;
  const spinner = getSpinner(url, sampleSize);
  // CHC uses a new browser context for each visit, so the cache will be clear for each visit.
  // We can set the options param to { cache: false } if we want to test speed with caching (which I don't)
  chCapturer.run(urlsArray, { abortOnFailure: true })
    .on('load', url => {})
    .on('done', (url, index) => {
      spinner.text = createSpinnerText(prettifiedUrl, index, sampleSize);
    })
    .on('fail', (url, err) => {
      console.error(chalk.red(`✗\n  ${err.message}`));
      allPingsSuccessful = false;
    })
    .on('har', har => { // HAR always triggers on completion, either successful (all hars completed) or failure
      mutateCreator(har);
      if (allPingsSuccessful) {
        spinner.succeed(`${createSpinnerText(prettifiedUrl, sampleSize, sampleSize)}. Results:`);
        const generateOutput = require('./process/generateOutput');
        try {
          generateOutput(har, shouldPrintHar);
        } catch (err) {
          console.error(chalk.red(`✗\n  ${err}`));
        }
      } else {
        spinner.fail('One or more URL loads failed. Result generation cancelled.');
      }
      process.stderr.write('\n');
      chrome.kill();
    });
});
