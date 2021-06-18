const readline = require('readline');
const fs = require('fs');
const foldermanager = require('./folderManager');

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  crlfDelay: Infinity
});

const avaliableOptions = ['CREATE', 'MOVE', 'DELETE', 'LIST'];

rl.on('line', (input) => {
    const args = input.split(' ')
    if (!avaliableOptions.includes(args[0].toUpperCase())) {
      rl.output.write(`\x1b[31mInvalid command: ${args[0]}\x1b[0m\n`)
    } else {
      switch (args[0].toUpperCase()) {
        case 'CREATE':
          foldermanager.create(args.slice(1))
          break;
        case 'MOVE':
          foldermanager.move(args.slice(1))
          break;
        case 'DELETE':
          foldermanager._delete(args.slice(1))
          break;
        case 'LIST':
          foldermanager.list()
          break;
        default:
          break;
      }
    }
});
