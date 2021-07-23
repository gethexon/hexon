const build = require("./utils/build");
const { addAll } = require("./utils/git");

async function wrap() {
  await build()
  await addAll()
}

wrap();
