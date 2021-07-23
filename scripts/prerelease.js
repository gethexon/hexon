const chalk = require("chalk");
const { NEXT_BRANCH, PRERELEASE_BRANCH } = require("./utils/constants");
const {
  listBranches,
  getCurrentBranch,
  checkout,
  forceRemoveBranch,
  branchThenCheckout,
  setUpstream,
} = require("./utils/git");

const { execaInherit } = require("./utils/execa");

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
    NEXT_BRANCH,
    "--no-ff",
    "-m",
    `Merge branch ${NEXT_BRANCH} to ${PRERELEASE_BRANCH}`,
  ]);
}

async function wrap() {
  const branches = await listBranches();
  if (!branches.includes(NEXT_BRANCH)) {
    console.log(chalk.green(`There no ${NEXT_BRANCH} branch. exiting...`));
    return;
  }

  const currentBranch = await getCurrentBranch();
  if (currentBranch !== PRERELEASE_BRANCH) await checkout(PRERELEASE_BRANCH);
  await mergeNextToPrerelease();
  await version();
  await forceRemoveBranch(NEXT_BRANCH);
  await branchThenCheckout(NEXT_BRANCH);
  await setUpstream(NEXT_BRANCH, "origin/" + NEXT_BRANCH);
  console.log(chalk.green("Prerelease done. Remember to push to remote."));
}

wrap();
