const execa = require("execa");

async function execaInherit(command, args, opt) {
  return execa(command, args, { ...opt, stdio: "inherit" });
}

async function execaPipe(command, args, opt) {
  return execa(command, args, { ...opt, stdio: "pipe" });
}

module.exports = {
  execaInherit,
  execaPipe,
};
