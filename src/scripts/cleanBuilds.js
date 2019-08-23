const fs = require('fs');
const path = require('path');

// Clears all files in the ./build folder (where the .hars are written)

const directory = './build';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});
