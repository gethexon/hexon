const chalk = require("chalk");
const inquirer = require("inquirer");

async function textConfirm(text, message) {
  message = message || `Please type ${chalk.yellow.bold(text)} to continue`;
  message += chalk.grey("\n Type q to exit.");
  await inquirer.prompt([
    {
      name: "text",
      type: "input",
      message: message,
      validate: (v) => {
        if (v === "q") {
          console.log("\nexiting...");
          process.exit(0);
        }
        return v === text || "not match, try again";
      },
    },
  ]);
}

module.exports = {
  textConfirm,
};
