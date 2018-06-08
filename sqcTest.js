const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  console.log(key)
  if(key.sequence === "\u0003") {process.exit()}
})