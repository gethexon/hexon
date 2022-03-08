const chalk = require("chalk")
const { reset } = require("./utils/git")
const { DEV_BRANCH, MASTER_BRANCH } = require("./utils/constants")
const {
  getCurrentBranch,
  checkout,
  addThenCommit,
  listLog,
} = require("./utils/git")

const { execaInherit } = require("./utils/execa")
const build = require("./utils/build")

async function version() {
  await execaInherit("lerna", [
    "version",
    "--conventional-commits",
    "--no-push",
    "-m",
    "chore: release",
  ])
}

async function wrap() {
  await checkout(DEV_BRANCH)
  await build()
  await addThenCommit("chore: build")
  await version()
  await checkout(MASTER_BRANCH)
  await reset(DEV_BRANCH, true)
  console.log(chalk.green("Release done. Remember to push to remote."))
}

wrap()
