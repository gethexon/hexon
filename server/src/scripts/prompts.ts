import inquirer from "inquirer"
import chalk from "chalk"
import { isBlog, toRealPath } from "~/shared/utils"

export async function requestPassword() {
  const answer = await inquirer.prompt({
    name: "password",
    message: "Password ?",
    type: "password",
    validate(v: string) {
      if (!v) return "Must not empty"
      return true
    },
  })
  const { password } = answer as {
    password: string
  }
  return password
}

export async function requestUsername() {
  const answer = await inquirer.prompt({
    name: "username",
    message: "Username ?",
    validate(v: string) {
      if (!v) return "Must not empty"
      return true
    },
  })
  const { username } = answer as {
    username: string
  }
  return username
}

export async function requestUserInfo() {
  const username = await requestUsername()
  const password = await requestPassword()
  return { username, password }
}

export async function requestPort(defaultPort: number) {
  const portPrompt = {
    name: "port",
    message: "Which port do you like Hexon running at?",
    default: defaultPort,
    validate(v: number) {
      return !isNaN(v) || `number is required ${typeof v} given`
    },
    prefix: chalk.blue("?"),
  }
  const answer = await inquirer.prompt(portPrompt)
  return String(answer.port as number)
}

export async function requestRoot() {
  const rootPrompt = {
    name: "root",
    message: `Your hexo blog path? ${chalk.grey(
      "Absolute or relative path to hexon."
    )}`,
    validate(v: string) {
      const truePath = toRealPath(v)
      try {
        return (
          isBlog(truePath) ||
          chalk.red.bold(truePath) + chalk.red(" is not a valid hexo blog.")
        )
      } catch (e) {
        console.error(e)
        return chalk.red("Fail to check path " + chalk.bold(truePath))
      }
    },
  }
  const answer = await inquirer.prompt(rootPrompt)
  return answer.root as string
}
