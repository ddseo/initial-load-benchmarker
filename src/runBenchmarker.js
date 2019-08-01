'use strict';

const chCapturer = require('chrome-har-capturer');
const chalk = require('chalk');

// ping website however many times, then download aggregate har
// generate results from HAR file (data?, graph?, har file?)

const sampleSize = 2;
const url = 'https://dev.mensio.com'; // TODO make this use a script argument if it's given

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
      const processHar = require('./processHar');
      processHar(har);
    }
  });
