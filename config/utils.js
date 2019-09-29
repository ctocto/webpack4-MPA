const chalk = require("chalk");
const ip = require("ip");

const port = 8089;

function getHost() {
  return ip.address();
}

function getPort(params) {
  return port;
}

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

function getDevDoneLog() {
  const host = getHost();
  return `
  You can now view ${chalk.bold('Your App')} in the browser.
  
    ${chalk.bold('Local:')}            http://localhost:${port}/
    ${chalk.bold('On Your Network:')}  http://${host}:${port}/
  
  Note that the development build is not optimized.
  To create a production build, use ${chalk.hex('#00a6cc')('npm run build')}.`;
}

module.exports = {
  getPort,
  getHost,
  getDevDoneLog,
  clearConsole
}