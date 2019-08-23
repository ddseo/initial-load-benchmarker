const args = require('yargs')
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

module.exports = args;
