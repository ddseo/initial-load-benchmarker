'use strict';

const chCapturer = require('chrome-har-capturer');
const chalk = require('chalk');
const launchChrome = require('./launchHeadlessChrome');
const argv = require('yargs')
  .options({
    sampleSize: {
      alias       : 'samples',
      description : 'Number of trials for which to ping the target site',
      type        : 'boolean',
      default     : 1,
    },
    url: {
      description : 'URL under test',
      type        : 'string',
      default     : 'https://dev.mensio.com',
    },
  })
  .help()
  .alias('help', 'h')
  .argv;

const sampleSize = argv.sampleSize;
const url = argv.url; // TODO make this use a script argument if it's given

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

launchChrome().then(chrome => {
  let allPingsSuccessful = true;
  // CHC uses a new browser context for each visit
  // This means the cache will be clear for each visit.
  // We can set the options param to { cache: false } if we want to test speed with caching (which I don't)
  chCapturer.run(urlsArray, {})
    .on('load', url => process.stderr.write(`- ${prettifyUrl(url)} `))
    .on('done', url => console.error(chalk.green('✓\n')))
    .on('fail', (url, err) => {
      console.error(chalk.red(`✗\n  ${err.message}\n`));
      allPingsSuccessful = false;
    })
    .on('har', har => { // This callback triggers when ALL the urls are done processing, with one har file containing all the results.
      if (allPingsSuccessful) {
        const generateOutput = require('./generateOutput');
        generateOutput(har);
      }
    });
});
