'use strict'

const chCapturer = require('chrome-har-capturer')
const chalk = require('chalk');

// for however many times: ping website and download har
// generate results from HAR files (data, graph?, zipped hars)

const urls = ['https://dev.mensio.com'];
const options = {};

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

const log = string => {
  process.stderr.write(string);
};

// CHC uses a new broser context for each visit (meaning that the cache will be clear for each visit)
// It uses your chrome profile though.
chCapturer.run(urls, options)
  .on('load', url => log(`- ${prettifyUrl(url)} `))
  .on('done', url => log(chalk.green('✓\n')))
  .on('fail', (url, err) => log(chalk.red(`✗\n  ${err.message}\n`)))
  .on('har', (har) => {
    // const fs = require('fs');
    const json = JSON.stringify(har, null, 4);
    const output = process.stdout;
    output.write(json);
    output.write('\n');
  });
