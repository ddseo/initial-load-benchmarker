const chromeLauncher = require('chrome-launcher');
const chalk = require('chalk');

// Asides from OS compatibility, chromeLauncher has the benefit of using a clean chrome profile each launch
const chromeFlags = ['--headless'];

module.exports = () => chromeLauncher.launch({
  port: 9222, // chrome launcher dies if this is set in the chromeFlags property rather than this custom port property
  chromeFlags,
}).then(chrome => {
  console.error(`${chalk.green('✓')} Chrome launched! Debug port listening on port ${chrome.port}`);
  return chrome;
}).catch(err => {
  console.error(`${chalk.red('✗')} Chrome launcher failed: \n${err}`);
  process.exitCode = 1;
});
