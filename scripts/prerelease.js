const chalk = require("chalk");
const { reset } = require("./utils/git");
const { DEV_BRANCH, PRERELEASE_BRANCH } = require("./utils/constants");
const {
  getCurrentBranch,
  checkout,
  addThenCommit,
  listLog,
} = require("./utils/git");

const { execaInherit } = require("./utils/execa");
const build = require("./utils/build");

async function version() {
  await execaInherit("lerna", [
    "version",
    "--conventional-commits",
    "--conventional-prerelease",
    "--no-push",
    "-m",
    "chore(release): publish",
    "--preid",
    "beta",
  ]);
}

async function wrap() {
  const currentBranch = await getCurrentBranch();
  if (currentBranch !== DEV_BRANCH) await checkout(DEV_BRANCH);
  await build();
  await addThenCommit("chore: build");
  const { commit } = (await listLog())[0];
  if (currentBranch !== PRERELEASE_BRANCH) await checkout(PRERELEASE_BRANCH);
  await reset(commit, true);
  await version();
  console.log(chalk.green("Prerelease done. Remember to push to remote."));
}

wrap();
