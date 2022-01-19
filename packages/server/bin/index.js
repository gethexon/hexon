'use strict';

require('reflect-metadata');
var commander = require('commander');
var path = require('path');
var chalk = require('chalk');
var inquirer = require('inquirer');
var tsyringe = require('tsyringe');
var fs = require('fs');
var JSONdb = require('simple-json-db');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const defaultRoot = path.resolve(process.cwd(), "data");
const defaultFilename = "common.db";
let StorageService = class StorageService {
    constructor() {
        this._root = defaultRoot;
        this._filename = defaultFilename;
        if (!fs.existsSync(this._root))
            fs.mkdirSync(this._root);
        this._db = new JSONdb__default["default"](path.resolve(this._root, this._filename));
    }
    get(key) {
        return this._db.get(key);
    }
    set(key, value) {
        this._db.set(key, value);
    }
    delete(key) {
        return this._db.delete(key);
    }
};
StorageService = __decorate([
    tsyringe.singleton(),
    __metadata("design:paramtypes", [])
], StorageService);

function isBlog(cwd) {
    var _a;
    let file;
    try {
        // 检查是否有对应文件
        file = fs__default["default"].readFileSync(path__default["default"].join(cwd, "package.json"), {
            encoding: "utf-8",
        });
        fs__default["default"].readFileSync(path__default["default"].join(cwd, "_config.yml"), { encoding: "utf-8" });
    }
    catch (err) {
        if (err.code === "ENOENT") {
            return false;
        }
        throw err;
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file);
    if (!((_a = packageJSON === null || packageJSON === void 0 ? void 0 : packageJSON.dependencies) === null || _a === void 0 ? void 0 : _a.hexo))
        return false;
    return true;
}
function toRealPath(value) {
    return path__default["default"].isAbsolute(value)
        ? value
        : path__default["default"].resolve(process.cwd(), "../..", value);
}

function section(title) {
    console.log();
    console.log(chalk__default["default"].blue.bold("⚙ " + title));
    console.log();
}
function log(...args) {
    console.log(...args);
}
function info(...args) {
    console.log(chalk__default["default"].blue(...args));
}
function success(...args) {
    console.log(chalk__default["default"].green(...args));
}
function warn(...args) {
    console.log(chalk__default["default"].yellow(...args));
}
function error(...args) {
    console.log(chalk__default["default"].red(...args));
}
const printer = {
    section,
    log,
    success,
    info,
    warn,
    error,
};
function readJsonFile(filename) {
    const file = fs__default["default"].readFileSync(filename, { encoding: "utf-8" });
    return JSON.parse(file);
}

const logo = (() => {
    try {
        fs__default["default"].readFileSync(path__default["default"].resolve(__dirname, "../assets/logo.art"), "utf-8");
    }
    catch (err) {
        console.error(err);
        return "Hexon";
    }
})();
const version = readJsonFile("./package.json").version;

const HEXO_BASE_DIR_KEY = "hexo-basedir";
const HEXON_PORT_KEY = "hexon-port";
const HEXON_DEFAULT_PORT = 5777;

function install () {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        console.log(chalk__default["default"].blue(logo));
        printer.section("Check version");
        printer.info(`Current Version: ${version}`);
        if (version.indexOf("-") >= 0) {
            printer.warn("This is a preview version!");
        }
        printer.section("Configuation");
        const portPrompt = {
            name: "port",
            message: "Which port do you like Hexon running at?",
            default: HEXON_DEFAULT_PORT,
            validate(v) {
                return !isNaN(v) || `number is required ${typeof v} given`;
            },
            prefix: chalk__default["default"].blue("?"),
        };
        const rootPrompt = {
            name: "root",
            message: `Your hexo blog path? ${chalk__default["default"].grey("Absolute or relative path to hexon.")}`,
            validate(v) {
                const truePath = toRealPath(v);
                try {
                    return (isBlog(truePath) ||
                        chalk__default["default"].red.bold(truePath) + chalk__default["default"].red(" is not a valid hexo blog."));
                }
                catch (e) {
                    console.error(e);
                    return chalk__default["default"].red("Fail to check path " + chalk__default["default"].bold(truePath));
                }
            },
        };
        const answer = yield inquirer__default["default"].prompt([portPrompt, rootPrompt]);
        const storage = tsyringe.container.resolve(StorageService);
        storage.set(HEXO_BASE_DIR_KEY, answer.root);
        storage.set(HEXON_PORT_KEY, answer.port);
        printer.section("Install");
        const base = path__default["default"].resolve(__dirname, "../../..");
        printer.success(`Hexon has been installed to \`${base}\``);
        printer.log(`Run \`yarn start\` to start`);
        printer.log(`Run \`yarn prd\` to start with pm2`);
        printer.log(`Run \`yarn stop\` to stop with pm2`);
        printer.log(`Run \`yarn restart\` to restart with pm2`);
        printer.log(chalk__default["default"].grey(`To uninstall, remove the following foler: ${base}`));
    });
}

const program = new commander.Command("npx .");
program.command("install").description("install hexon").action(install);
program.parse();
