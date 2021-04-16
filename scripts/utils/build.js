const execa = require("execa");
const path = require("path");

module.exports = async () =>{
  await execa("quasar", ["build", "-m", "pwa"], {
    cwd: path.resolve(process.cwd(), "./packages/web/"),
    stdio: "inherit",
  });
}
