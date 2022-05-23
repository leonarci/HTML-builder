const { stdin: input, stdout: output } = require('process');
const { createInterface } = require('readline');
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const outputFile = fs.createWriteStream(file, 'utf8');

const rl = createInterface(input, output);

rl.question('enter your text\n',cb );

rl.on('SIGINT', () => {
  output.write('Thank you!');
  process.exit();
});

function cb (answer) {
  if (answer.replace(/\r?\n/, '') === 'exit') {
    output.write('Thank you!');
    process.exit();
  }
  outputFile.write(answer + '\n');
  rl.question('',cb );
}
