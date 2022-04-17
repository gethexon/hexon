import chalk from "chalk"
import inquirer from "inquirer"
import { scriptStore } from "~/shared/store"

function getAvailableKeys() {
  const keys = new Set([
    "git-save",
    "git-sync",
    "hexo-clean",
    "hexo-generate",
    "hexo-deploy",
    ...scriptStore.keys.value,
  ])
  return [...keys.keys()].map((value) => {
    const v = scriptStore.getScript(value)
    const name = v ? `${value}: ${v}` : value
    return { name, value }
  })
}

async function pickOneScript() {
  const { key } = await inquirer.prompt({
    name: "key",
    type: "list",
    message: "Which script do you want to manage?",
    choices: () => getAvailableKeys(),
  })
  return key
}

async function getInput(key: string) {
  const currnet =
    scriptStore.hasScript(key) && `- Current: ${scriptStore.getScript(key)}`
  const { value } = await inquirer.prompt({
    name: "value",
    message: `Please input some script to run your script file (with relative path to your hexo blog folder).
${chalk.gray(
  `- e.g. \`bash ./my_deploy_script.sh\`
- Leave blank to remove.
${currnet ? `${currnet}\n` : ""}`
)}`,
  })
  return value
}

export default async function script() {
  const key = await pickOneScript()
  const value = await getInput(key)
  scriptStore.setScript(key, value)
  console.log(chalk.bgGreen.white(` Script ${value ? "Saved" : "Removed"} `))
}
