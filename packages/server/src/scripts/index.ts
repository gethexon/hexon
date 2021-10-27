import { Command } from "commander";
import "./bootstrap";
import install from "./install";
const program = new Command("npx .");
program.command("install").description("install hexon").action(install);
program.parse();
