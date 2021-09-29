const path = require("path");
const fs = require("fs");
module.exports = {
  title: "Hexon UI components",
  description: "Just playing around.",
  themeConfig: {
    sidebar: { "/": getSidebar() },
  },
};
function getSidebar() {
  return fs
    .readdirSync(path.resolve(__dirname, ".."))
    .filter((filename) => path.extname(filename) === ".md")
    .map((filename) => path.basename(filename, path.extname(filename)))
    .filter((name) => name !== "index")
    .map((name) => ({ text: name, link: `/${name.toLocaleLowerCase()}.html` }));
}
console.log(getSidebar());
