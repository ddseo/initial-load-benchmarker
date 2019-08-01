'use strict'

// So for each ping:
// - parse the har file to get the data points (time for all network reqs to complete)
// - put the data into whichever format and generate whatever infographics
// - export the .har

const processHar = har => {
  const json = JSON.stringify(har, null, 4);
  const output = process.stdout;
  output.write(json);
  output.write('\n');
};

module.exports = processHar;
