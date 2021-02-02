import fs from 'fs';
import readline from 'readline';

function readLinesN2M(filename, n, m, func, onClose) {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(filename),
  });

  let lineNumber = 0;
  let done = false;

  lineReader.on('line', function(line) {
    lineNumber++;
    if (lineNumber >= n && lineNumber < m) func(line, lineNumber);
    else if (lineNumber > m) lineReader.close();
  });

  lineReader.on('close', function() {
    if(!done) {
      done = true;
      onClose();
    }
  })
}

export default readLinesN2M;
