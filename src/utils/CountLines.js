import fs from 'fs';
import readline from 'readline';

function countLines(filename, func) {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(filename),
  });

  let lineNumber = 0;
  let done = false;

  lineReader.on('line', function(line) {
    lineNumber++;
  });

  lineReader.on('close', function() {
    if(!done) {
      done = true;
      func(lineNumber);
    }
  });
}

export default countLines;
