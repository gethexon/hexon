import "reflect-metadata"
import { Command } from "commander"
import install from "./install"
const program = new Command("npx .")
program.command("install").description("install hexon").action(install)
program.parse()
