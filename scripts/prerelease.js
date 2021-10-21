const chalk = require("chalk");
const { DEV_BRANCH, PRERELEASE_BRANCH } = require("./utils/constants");
const {
  listBranches,
  getCurrentBranch,
  checkout,
  forceRemoveBranch,
  branchThenCheckout,
  setUpstream,
  addThenCommit,
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

async function mergeNextToPrerelease() {
  await execaInherit("git", [
    "merge",
    DEV_BRANCH,
    "--no-ff",
    "-m",
    `Merge branch ${DEV_BRANCH} to ${PRERELEASE_BRANCH}`,
  ]);
}

async function wrap() {
  const branches = await listBranches();
  if (!branches.includes(DEV_BRANCH)) {
    console.log(chalk.green(`There no ${DEV_BRANCH} branch. exiting...`));
    return;
  }

  const currentBranch = await getCurrentBranch();
  await build();
  await addThenCommit("chore: build");
  if (currentBranch !== PRERELEASE_BRANCH) await checkout(PRERELEASE_BRANCH);
  await mergeNextToPrerelease();
  await version();
  await forceRemoveBranch(DEV_BRANCH);
  await branchThenCheckout(DEV_BRANCH);
  await setUpstream(DEV_BRANCH, "origin/" + DEV_BRANCH);
  console.log(chalk.green("Prerelease done. Remember to push to remote."));
}

wrap();
