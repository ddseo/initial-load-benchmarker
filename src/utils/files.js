const { parse } = require('url');
const fs = require('fs');

const getCurrentTimeString = () => { // ISO with colons and ms removed
  const currDate = new Date();
  return currDate.getUTCFullYear() +
  '-' + `${currDate.getUTCMonth() + 1}`.padStart(2, '0') +
  '-' + `${currDate.getUTCDate()}`.padStart(2, '0') +
  'T' + `${currDate.getUTCHours()}`.padStart(2, '0') +
  '' + `${currDate.getUTCMinutes()}`.padStart(2, '0') +
  '' + `${currDate.getUTCSeconds()}`.padStart(2, '0') +
  'Z';
};

const createBuildDirName = (url) => {
  const urlHost = parse(url).host;
  const timeString = getCurrentTimeString();
  return `${urlHost}-${timeString}`;
};

const createOutputFileName = (url, fileTypeName, extension) => {
  const urlHost = parse(url).host;
  return `${urlHost}-${fileTypeName}.${extension}`;
};

const ensureDirExists = dirPath => {
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  createBuildDirName,
  createOutputFileName,
  ensureDirExists,
};
