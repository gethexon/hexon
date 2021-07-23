const { execaInherit } = require("./execa");

module.exports = async () =>{
  await execaInherit("yarn", ["build"]);
}
