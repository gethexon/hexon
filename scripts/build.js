const { execaInherit } = require("./utils/execa");
const build = require("./utils/build");

async function wrap() {
  await build();
  await execaInherit("git", ["add", "."]);
}

wrap();
