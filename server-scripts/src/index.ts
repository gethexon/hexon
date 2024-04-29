import "reflect-metadata"
import { Command } from "commander"
import install from "./install"
import resetPassword from "./reset-password"
import script from "./script"
const program = new Command("npx .")
program.command("install").description("install hexon").action(install)
program.command("resetpwd").description("reset password").action(resetPassword)
program.command("script").description("manage custom script").action(script)
program.parse()
