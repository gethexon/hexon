const chalk = require("chalk")
const { MASTER_BRANCH } = require("./utils/constants")
const { checkout, addThenCommit } = require("./utils/git")

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
  await checkout(MASTER_BRANCH)
  await build()
  await addThenCommit("chore: build")
  await version()
  console.log(chalk.green("Hotfix release done. Remember to push to remote."))
}

wrap()
