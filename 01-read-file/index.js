const { stdout } = process;
const { createReadStream } = require('fs');
const path = require('path');
  
const file = path.join(__dirname, 'text.txt');
const readableStream = createReadStream(file, 'utf-8');
readableStream.on('data', chunk => stdout.write(chunk));
readableStream.on('error', error => stdout.write(error.message));
