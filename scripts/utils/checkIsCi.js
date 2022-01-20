const chalk = require("chalk")

const ci = "CI"
module.exports = function checkIsCi(message = "Must run by ci!") {
  const { OPTERATOR } = process.env
  if (OPTERATOR !== ci) {
    console.log(chalk.red(message))
    process.exit(F)
  }
}
