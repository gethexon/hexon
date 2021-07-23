const chalk = require("chalk");
const build = require("./utils/build");
const { addThenCommit } = require("./utils/git");
const { NEXT_BRANCH } = require("./utils/constants");
const {
  getCurrentBranch,
  merge,
  checkout,
  rebase,
  listLog,
} = require("./utils/git");
const { textConfirm } = require("./utils/confirm");

/**
 * 在 feature 分支开发后合并 commit 再 merge 到 next
 */
async function notifyRebaseToOneCommit() {
  const logs = await listLog(2);
  logs.forEach((log) => {
    if (log.ref) console.log(chalk.green(log.ref));
    console.log(chalk.yellow(log.commit) + " " + log.message);
    console.log(chalk.grey(log.date));
  });
  console.log();
  await textConfirm(
    "rebase",
    `Remember to ${chalk.yellow.bold(
      "REBASE"
    )} feature branch before merge to ${NEXT_BRANCH}. Type ${chalk.yellow(
      "rebase"
    )} to continue.`
  );
}

async function wrap() {
  const branch = await getCurrentBranch();
  await rebase(NEXT_BRANCH);
  await notifyRebaseToOneCommit();
  await build();
  await addThenCommit('chore: build')
  await checkout(NEXT_BRANCH);
  await merge(branch);
}

wrap();
