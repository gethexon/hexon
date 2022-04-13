'use strict';

require('reflect-metadata');
var tsyringe = require('tsyringe');
var http = require('http');
var fs = require('fs');
var path = require('path');
var JSONdb = require('simple-json-db');
var HexoCore = require('hexo');
var chalk = require('chalk');
var dayjs = require('dayjs');
require('debug');
var cors = require('@koa/cors');
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var compress = require('koa-compress');
var logger = require('koa-logger');
var mount = require('koa-mount');
var compose = require('koa-compose');
var Router = require('@koa/router');
var CryptoJS = require('crypto-js');
var httpErrors = require('http-errors');
var typedef = require('@hexon/typedef');
var execa = require('execa');
var koaAuthentication = require('@winwin/koa-authentication');
var crypto = require('crypto');
var JSEncrypt = require('node-jsencrypt');
var serve = require('koa-static');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);
var HexoCore__default = /*#__PURE__*/_interopDefaultLegacy(HexoCore);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var bodyParser__default = /*#__PURE__*/_interopDefaultLegacy(bodyParser);
var compress__default = /*#__PURE__*/_interopDefaultLegacy(compress);
var logger__default = /*#__PURE__*/_interopDefaultLegacy(logger);
var mount__default = /*#__PURE__*/_interopDefaultLegacy(mount);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var CryptoJS__default = /*#__PURE__*/_interopDefaultLegacy(CryptoJS);
var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var JSEncrypt__default = /*#__PURE__*/_interopDefaultLegacy(JSEncrypt);
var serve__default = /*#__PURE__*/_interopDefaultLegacy(serve);

/**
 * @deprecated
 */
const HEXO_BASE_DIR_KEY$1 = "hexo-basedir";
const BRIEF_LENGTH = 500;
const HEXON_PORT_KEY = "@hexon/port";
const HEXON_DEFAULT_PORT = 5777;

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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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

// src/shared/constants.ts
var HEXO_BASE_DIR_KEY = "hexo-basedir";
var BRIEF_LENGTH = 500;
var HEXON_PORT_KEY = "@hexon/port";
var HEXON_DEFAULT_PORT = 5777;

// src/shared/storage-service.ts
var import_tsyringe = require("tsyringe");
var import_fs = require("fs");
var import_path = require("path");
var import_simple_json_db = __toESM(require("simple-json-db"));
var defaultRoot = (0, import_path.resolve)(process.cwd(), "data");
var defaultFilename = "common.db";
var StorageService = class {
  constructor() {
    this._root = defaultRoot;
    this._filename = defaultFilename;
    if (!(0, import_fs.existsSync)(this._root))
      (0, import_fs.mkdirSync)(this._root);
    this._db = new import_simple_json_db.default((0, import_path.resolve)(this._root, this._filename));
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
StorageService = __decorateClass([
  (0, import_tsyringe.singleton)()
], StorageService);

// src/server/services/hexo-instance-service.ts
var import_tsyringe3 = require("tsyringe");
var import_hexo = __toESM(require("hexo"));
var import_path4 = __toESM(require("path"));

// src/server/services/log-service.ts
var import_tsyringe2 = require("tsyringe");

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  const styles2 = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  styles2.color.gray = styles2.color.blackBright;
  styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
  styles2.color.grey = styles2.color.blackBright;
  styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
  for (const [groupName, group] of Object.entries(styles2)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles2[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles2[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles2, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles2, "codes", {
    value: codes,
    enumerable: false
  });
  styles2.color.close = "\x1B[39m";
  styles2.bgColor.close = "\x1B[49m";
  styles2.color.ansi = wrapAnsi16();
  styles2.color.ansi256 = wrapAnsi256();
  styles2.color.ansi16m = wrapAnsi16m();
  styles2.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles2, {
    rgbToAnsi256: {
      value: (red, green, blue) => {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value: (hex) => {
        const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let { colorString } = matches.groups;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles2.rgbToAnsi256(...styles2.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value: (code) => {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles2.ansi256ToAnsi(styles2.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles2.ansi256ToAnsi(styles2.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles2;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("process"), 1);
var import_node_os = __toESM(require("os"), 1);
var import_node_tty = __toESM(require("tty"), 1);
function hasFlag(flag, argv = import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app":
        return version >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2;
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, __spreadValues({
    streamIsTTY: stream && stream.isTTY
  }, options));
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, __spreadProps(__spreadValues({}, styles), {
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
}));
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/server/services/log-service.ts
var import_dayjs = __toESM(require("dayjs"));
var DEFAULT_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss.SSS";
var LogService = class {
  constructor() {
    this.scope = "";
    this.dateFormat = DEFAULT_DATE_FORMAT;
  }
  _prefix(type) {
    let prefix = "";
    this.scope && (prefix += source_default[type].bold(`[${this.scope}]`));
    prefix += source_default.blue(`[${(0, import_dayjs.default)().format(this.dateFormat)}]`);
    return prefix;
  }
  _log(...args) {
    console.log(...args);
  }
  _error(...args) {
    console.error(...args);
  }
  setScope(scope) {
    this.scope = scope;
  }
  log(...args) {
    this._log(this._prefix("green"), ...args);
  }
  error(...args) {
    this._error(this._prefix("red"), ...args);
  }
  logWithUser(user, ...args) {
    this._log(this._prefix("green") + source_default.yellow.dim(`[${user.username}:${user.slug}]`), ...args);
  }
  static create(scope) {
    const instance = import_tsyringe2.container.resolve(LogService);
    instance.setScope(scope);
    return instance;
  }
};

// src/shared/utils.ts
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
function isBlog(cwd) {
  var _a;
  let file;
  try {
    file = import_fs2.default.readFileSync(import_path2.default.join(cwd, "package.json"), {
      encoding: "utf-8"
    });
    import_fs2.default.readFileSync(import_path2.default.join(cwd, "_config.yml"), { encoding: "utf-8" });
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    }
    throw err;
  }
  const packageJSON = JSON.parse(file);
  if (!((_a = packageJSON == null ? void 0 : packageJSON.dependencies) == null ? void 0 : _a.hexo))
    return false;
  return true;
}
function toRealPath(value) {
  return import_path2.default.isAbsolute(value) ? value : import_path2.default.resolve(process.cwd(), "../..", value);
}

// src/server/utils.ts
var import_debug = __toESM(require("debug"));
var import_path3 = __toESM(require("path"));
var DEV = process.env.NODE_ENV !== "production";
function expandHomeDir(fullpath) {
  const homedir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
  if (!fullpath)
    return fullpath;
  if (fullpath == "~")
    return homedir;
  if (fullpath.slice(0, 2) != "~/")
    return fullpath;
  return import_path3.default.join(homedir, fullpath.slice(2));
}

// src/server/services/hexo-instance-service.ts
var NotHexoBlogError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "NotHexoBlogError";
  }
};
var EmptyHexoBlogError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "EmptyHexoBlogError";
  }
};
var HexoCoreInitError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "HexoCoreInitError";
  }
};
var HexoCoreInitiatingError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "HexoCoreInitiatingError";
  }
};
var HEXO_BASE_DIR_KEY2 = "hexo-basedir";
var HEXO_OPTIONS_KEY = "hexo-options";
var HexoInstanceService = class {
  constructor(_logService, _storageService) {
    this._logService = _logService;
    this._storageService = _storageService;
    this._options = null;
    this._base = null;
    this._hexo = null;
    this._ready = false;
    this._logService.setScope("hexo-instance-service");
  }
  _withOptionsOverrides(options) {
    return __spreadProps(__spreadValues({}, options), { draft: true, drafts: true });
  }
  _setHexoBase() {
    const base = this._storageService.get(HEXO_BASE_DIR_KEY2);
    const base_dir = import_path4.default.resolve(__dirname, toRealPath(base));
    if (!isBlog(base_dir))
      throw new NotHexoBlogError();
    this._base = base_dir;
  }
  _setOptions() {
    this._options = this._storageService.get(HEXO_OPTIONS_KEY) || {};
    this._options.silent = DEV ? false : this._options.silent;
  }
  _createHexoInstance() {
    if (!this._base)
      throw new EmptyHexoBlogError();
    this._hexo = new import_hexo.default(this._base, this._withOptionsOverrides(this._options));
  }
  async _init() {
    this._logService.log("real init start");
    this._ready = false;
    await this._setHexoBase();
    await this._setOptions();
    await this._createHexoInstance();
    await this._hexo.init();
    await this._hexo.watch();
    this._ready = true;
    this._logService.log("real init finished");
  }
  async setOptions(options) {
    this._storageService.set(HEXO_OPTIONS_KEY, options);
    this._logService.log("options set");
  }
  async init(retry = false) {
    if (!retry && HexoInstanceService.INITING) {
      throw new HexoCoreInitiatingError();
    }
    try {
      HexoInstanceService.CURRENT_RETRY++;
      HexoInstanceService.INITING = true;
      HexoInstanceService.INIT_ERROR = null;
      await this._init();
      HexoInstanceService.CURRENT_RETRY = 0;
      HexoInstanceService.INITING = false;
    } catch (err) {
      this._logService.error(err);
      this._logService.error(`error when init hexo instance. `);
      this._logService.error(`retry in ${HexoInstanceService.RETRY_INTERVAL} ms.`, `${HexoInstanceService.CURRENT_RETRY}/${HexoInstanceService.MAX_RETRY}`);
      if (HexoInstanceService.CURRENT_RETRY >= HexoInstanceService.MAX_RETRY) {
        HexoInstanceService.INIT_ERROR = new HexoCoreInitError(String(err));
        HexoInstanceService.INITING = false;
        HexoInstanceService.CURRENT_RETRY = 0;
        throw HexoInstanceService.INIT_ERROR;
      }
      await new Promise((resolve2) => {
        setTimeout(() => {
          resolve2(this.init(true));
        }, HexoInstanceService.RETRY_INTERVAL);
      });
    }
  }
  async getBaseDir() {
    if (!this._ready)
      await this.init();
    return this._base;
  }
  async getInstance() {
    if (!this._ready)
      await this.init();
    this._logService.log("instance required");
    return this._hexo;
  }
  async getInstanceWithOriginOptions(genOptions = (o) => o) {
    const newOptions = genOptions(this._options);
    const hexo = new import_hexo.default(this._base, newOptions);
    await hexo.init();
    await hexo.watch();
    HexoInstanceService.TO_BE_CLEANED++;
    this._logService.log("instance with options required");
    this._logService.log(`${HexoInstanceService.TO_BE_CLEANED} extra instance to be cleaned`);
    const cleanup = async () => {
      await hexo.unwatch();
      HexoInstanceService.TO_BE_CLEANED--;
      this._logService.log("instance with options cleaned");
      if (HexoInstanceService.TO_BE_CLEANED === 0) {
        this._logService.log("all instances have been cleaned");
      } else {
        this._logService.log(`${HexoInstanceService.TO_BE_CLEANED} extra instance to be cleaned`);
      }
    };
    return { hexo, cleanup };
  }
  async runBetweenReload(fn) {
    const unload = async () => {
      HexoInstanceService.INIT_ERROR = null;
      await this._hexo.unwatch();
    };
    const load = async () => {
      await this._hexo.watch();
      HexoInstanceService.INITING = false;
    };
    const markHexoInitError = (err) => {
      this._ready = false;
      HexoInstanceService.INIT_ERROR = new HexoCoreInitError(String(err));
      HexoInstanceService.INITING = false;
      throw HexoInstanceService.INIT_ERROR;
    };
    HexoInstanceService.INITING = true;
    await unload().catch(markHexoInitError);
    const res = await Promise.resolve(fn());
    await load().catch(markHexoInitError);
    return res;
  }
};
HexoInstanceService.INITING = false;
HexoInstanceService.RETRY_INTERVAL = 1e3;
HexoInstanceService.MAX_RETRY = 2;
HexoInstanceService.CURRENT_RETRY = 0;
HexoInstanceService.TO_BE_CLEANED = 0;
HexoInstanceService = __decorateClass([
  (0, import_tsyringe3.injectable)(),
  (0, import_tsyringe3.singleton)(),
  __decorateParam(0, (0, import_tsyringe3.inject)(LogService)),
  __decorateParam(1, (0, import_tsyringe3.inject)(StorageService))
], HexoInstanceService);

// src/server/app.ts
var import_cors = __toESM(require("@koa/cors"));
var import_koa5 = __toESM(require("koa"));
var import_koa_bodyparser = __toESM(require("koa-bodyparser"));
var import_koa_compress = __toESM(require("koa-compress"));
var import_koa_logger = __toESM(require("koa-logger"));
var import_koa_mount2 = __toESM(require("koa-mount"));

// src/server/apps/index.ts
var import_koa_compose = __toESM(require("koa-compose"));
var import_koa_mount = __toESM(require("koa-mount"));

// src/server/apps/install/index.ts
var import_koa = __toESM(require("koa"));

// src/server/apps/install/router.ts
var import_router = __toESM(require("@koa/router"));
var import_tsyringe7 = require("tsyringe");

// src/server/apps/install/service.ts
var import_tsyringe6 = require("tsyringe");

// src/shared/account-storage-service.ts
var import_crypto_js = require("crypto-js");
var import_tsyringe4 = require("tsyringe");
var import_http_errors = require("http-errors");
var AccountService = class {
  constructor(_storage) {
    this._storage = _storage;
  }
  _encrypt(raw) {
    return (0, import_crypto_js.SHA1)(raw).toString();
  }
  _toStorage(info) {
    this._storage.set(AccountService.KEY, info);
  }
  _fromStorage() {
    const { username = "", password = "" } = this._storage.get(AccountService.KEY) || {};
    return { username, password };
  }
  setUserInfo(username, password) {
    this._storage.set(AccountService.KEY, {
      username,
      password: this._encrypt(password)
    });
  }
  getUsername() {
    return this._fromStorage().username;
  }
  setUsername(username) {
    const info = this._fromStorage();
    info.username = username;
    this._toStorage(info);
  }
  setPassword(password) {
    const info = this._fromStorage();
    info.password = this._encrypt(password);
    this._toStorage(info);
  }
  setEncrptedPassword(password) {
    const info = this._fromStorage();
    info.password = password;
    this._toStorage(info);
  }
  verify(username, password) {
    const info = this._fromStorage();
    if (username !== info.username) {
      throw new import_http_errors.Unauthorized();
    }
    if (this._encrypt(password) !== info.password) {
      throw new import_http_errors.Unauthorized();
    }
  }
};
AccountService.KEY = "userinfo";
AccountService = __decorateClass([
  (0, import_tsyringe4.injectable)(),
  (0, import_tsyringe4.singleton)(),
  __decorateParam(0, (0, import_tsyringe4.inject)(StorageService))
], AccountService);

// src/server/services/auth-storage-service.ts
var import_tsyringe5 = require("tsyringe");
var AuthStorageService = class {
  constructor(_storage, _logService) {
    this._storage = _storage;
    this._logService = _logService;
    this._logService.setScope("auth-storage-service");
  }
  _toStorage(info) {
    this._storage.set(AuthStorageService.KEY, info);
  }
  _fromStorage() {
    const {
      secret = "secret",
      expiresIn = "1h",
      refreshableIn = "7d"
    } = this._storage.get(AuthStorageService.KEY) || {};
    return { secret, expiresIn, refreshableIn };
  }
  setAuthInfo(info) {
    this._toStorage(info);
    this._logService.log(`set auth info`);
  }
  getSecret() {
    const s = this._fromStorage().secret;
    this._logService.log(`get secret`);
    return s;
  }
  getAuthInfo() {
    const s = this._fromStorage();
    this._logService.log(`get auth info`);
    return s;
  }
};
AuthStorageService.KEY = "authinfo";
AuthStorageService = __decorateClass([
  (0, import_tsyringe5.injectable)(),
  (0, import_tsyringe5.singleton)(),
  __decorateParam(0, (0, import_tsyringe5.inject)(StorageService)),
  __decorateParam(1, (0, import_tsyringe5.inject)(LogService))
], AuthStorageService);

// src/server/apps/install/service.ts
var InstallService = class {
  constructor(_storage, _account, _auth, _logService) {
    this._storage = _storage;
    this._account = _account;
    this._auth = _auth;
    this._logService = _logService;
    if (!this._storage.get(InstallService.KEY))
      this._storage.set(InstallService.KEY, false);
    this._logService.setScope("install-service");
  }
  isInstalled() {
    const res = this._storage.get(InstallService.KEY);
    this._logService.log("query installed", res);
    return res;
  }
  async install(options) {
    const _a = options, { username, password } = _a, auth2 = __objRest(_a, ["username", "password"]);
    this._account.setUserInfo(username, password);
    this._auth.setAuthInfo(auth2);
    this._storage.set(InstallService.KEY, true);
    this._logService.log("installed");
  }
};
InstallService.KEY = "@hexon/installed";
InstallService = __decorateClass([
  (0, import_tsyringe6.injectable)(),
  (0, import_tsyringe6.singleton)(),
  __decorateParam(0, (0, import_tsyringe6.inject)(StorageService)),
  __decorateParam(1, (0, import_tsyringe6.inject)(AccountService)),
  __decorateParam(2, (0, import_tsyringe6.inject)(AuthStorageService)),
  __decorateParam(3, (0, import_tsyringe6.inject)(LogService))
], InstallService);

// src/server/apps/install/router.ts
var router = new import_router.default();
router.get("/", (ctx) => {
  const service = import_tsyringe7.container.resolve(InstallService);
  if (service.isInstalled()) {
    ctx.status = 404;
  } else {
    ctx.status = 200;
    ctx.body = "Waiting For Install";
  }
});
router.post("/", async (ctx) => {
  const service = import_tsyringe7.container.resolve(InstallService);
  if (service.isInstalled()) {
    ctx.status = 404;
    return;
  }
  const { username, password, secret, expiresIn, refreshableIn } = ctx.request.body;
  if ([username, password, secret, expiresIn, refreshableIn].some((value) => !value))
    ctx.status = 400;
  else {
    await service.install({
      username,
      password,
      secret,
      expiresIn,
      refreshableIn
    });
    ctx.status = 200;
  }
});
var router_default = router;

// src/server/apps/install/controller.ts
var import_tsyringe8 = require("tsyringe");
var checkInstall = () => async (ctx, next) => {
  const service = import_tsyringe8.container.resolve(InstallService);
  if (!service.isInstalled()) {
    ctx.status = 404;
    ctx.body = "Install required";
  } else
    await next();
};

// src/server/apps/install/index.ts
var app = new import_koa.default();
app.use(router_default.routes());
app.use(router_default.allowedMethods());
var install_default = app;

// src/server/apps/health/index.ts
var import_koa2 = __toESM(require("koa"));
var import_router3 = __toESM(require("@koa/router"));
var router2 = new import_router3.default();
router2.get("/", (ctx) => {
  ctx.status = 200;
});
var app2 = new import_koa2.default();
app2.use(router2.routes());
app2.use(router2.allowedMethods());
var health_default = app2;

// src/server/apps/hexo/index.ts
var import_koa3 = __toESM(require("koa"));

// src/server/routers/hexo-router.ts
var import_typedef = require("@hexon/typedef");
var import_tsyringe11 = require("tsyringe");
var import_router4 = __toESM(require("@koa/router"));

// src/server/services/hexo-service.ts
var import_path5 = __toESM(require("path"));
var import_tsyringe10 = require("tsyringe");
var import_fs3 = __toESM(require("fs"));

// node_modules/execa/index.js
var import_node_buffer = require("buffer");
var import_node_path2 = __toESM(require("path"), 1);
var import_node_child_process = __toESM(require("child_process"), 1);
var import_node_process3 = __toESM(require("process"), 1);
var import_cross_spawn = __toESM(require_cross_spawn(), 1);

// node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}

// node_modules/npm-run-path/index.js
var import_node_process2 = __toESM(require("process"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_url = __toESM(require("url"), 1);

// node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env: env2 = process.env,
    platform = process.platform
  } = options;
  if (platform !== "win32") {
    return "PATH";
  }
  return Object.keys(env2).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

// node_modules/npm-run-path/index.js
function npmRunPath(options = {}) {
  const {
    cwd = import_node_process2.default.cwd(),
    path: path_ = import_node_process2.default.env[pathKey()],
    execPath = import_node_process2.default.execPath
  } = options;
  let previous;
  const cwdString = cwd instanceof URL ? import_node_url.default.fileURLToPath(cwd) : cwd;
  let cwdPath = import_node_path.default.resolve(cwdString);
  const result = [];
  while (previous !== cwdPath) {
    result.push(import_node_path.default.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = import_node_path.default.resolve(cwdPath, "..");
  }
  result.push(import_node_path.default.resolve(cwdString, execPath, ".."));
  return [...result, path_].join(import_node_path.default.delimiter);
}
function npmRunPathEnv(_a = {}) {
  var _b = _a, { env: env2 = import_node_process2.default.env } = _b, options = __objRest(_b, ["env"]);
  env2 = __spreadValues({}, env2);
  const path8 = pathKey({ env: env2 });
  options.path = env2[path8];
  env2[path8] = npmRunPath(options);
  return env2;
}

// node_modules/mimic-fn/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  Object.defineProperty(to, "toString", __spreadProps(__spreadValues({}, toStringDescriptor), { value: newToString }));
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}

// node_modules/onetime/index.js
var calledFunctions = /* @__PURE__ */ new WeakMap();
var onetime = (function_, options = {}) => {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected a function");
  }
  let returnValue;
  let callCount = 0;
  const functionName = function_.displayName || function_.name || "<anonymous>";
  const onetime2 = function(...arguments_) {
    calledFunctions.set(onetime2, ++callCount);
    if (callCount === 1) {
      returnValue = function_.apply(this, arguments_);
      function_ = null;
    } else if (options.throw === true) {
      throw new Error(`Function \`${functionName}\` can only be called once`);
    }
    return returnValue;
  };
  mimicFunction(onetime2, function_);
  calledFunctions.set(onetime2, callCount);
  return onetime2;
};
onetime.callCount = (function_) => {
  if (!calledFunctions.has(function_)) {
    throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
  }
  return calledFunctions.get(function_);
};
var onetime_default = onetime;

// node_modules/human-signals/build/src/main.js
var import_os2 = require("os");

// node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals = function() {
  const length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal);
};
var getRealtimeSignal = function(value, index) {
  return {
    name: `SIGRT${index + 1}`,
    number: SIGRTMIN + index,
    action: "terminate",
    description: "Application-specific signal (realtime)",
    standard: "posix"
  };
};
var SIGRTMIN = 34;
var SIGRTMAX = 64;

// node_modules/human-signals/build/src/signals.js
var import_os = require("os");

// node_modules/human-signals/build/src/core.js
var SIGNALS = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
];

// node_modules/human-signals/build/src/signals.js
var getSignals = function() {
  const realtimeSignals = getRealtimeSignals();
  const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
  return signals;
};
var normalizeSignal = function({
  name,
  number: defaultNumber,
  description,
  action,
  forced = false,
  standard
}) {
  const {
    signals: { [name]: constantSignal }
  } = import_os.constants;
  const supported = constantSignal !== void 0;
  const number = supported ? constantSignal : defaultNumber;
  return { name, number, description, supported, action, forced, standard };
};

// node_modules/human-signals/build/src/main.js
var getSignalsByName = function() {
  const signals = getSignals();
  return signals.reduce(getSignalByName, {});
};
var getSignalByName = function(signalByNameMemo, { name, number, description, supported, action, forced, standard }) {
  return __spreadProps(__spreadValues({}, signalByNameMemo), {
    [name]: { name, number, description, supported, action, forced, standard }
  });
};
var signalsByName = getSignalsByName();
var getSignalsByNumber = function() {
  const signals = getSignals();
  const length = SIGRTMAX + 1;
  const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
  return Object.assign({}, ...signalsA);
};
var getSignalByNumber = function(number, signals) {
  const signal = findSignalByNumber(number, signals);
  if (signal === void 0) {
    return {};
  }
  const { name, description, supported, action, forced, standard } = signal;
  return {
    [number]: {
      name,
      number,
      description,
      supported,
      action,
      forced,
      standard
    }
  };
};
var findSignalByNumber = function(number, signals) {
  const signal = signals.find(({ name }) => import_os2.constants.signals[name] === number);
  if (signal !== void 0) {
    return signal;
  }
  return signals.find((signalA) => signalA.number === number);
};
var signalsByNumber = getSignalsByNumber();

// node_modules/execa/lib/error.js
var getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
  if (timedOut) {
    return `timed out after ${timeout} milliseconds`;
  }
  if (isCanceled) {
    return "was canceled";
  }
  if (errorCode !== void 0) {
    return `failed with ${errorCode}`;
  }
  if (signal !== void 0) {
    return `was killed with ${signal} (${signalDescription})`;
  }
  if (exitCode !== void 0) {
    return `failed with exit code ${exitCode}`;
  }
  return "failed";
};
var makeError = ({
  stdout,
  stderr,
  all,
  error,
  signal,
  exitCode,
  command,
  escapedCommand,
  timedOut,
  isCanceled,
  killed,
  parsed: { options: { timeout } }
}) => {
  exitCode = exitCode === null ? void 0 : exitCode;
  signal = signal === null ? void 0 : signal;
  const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
  const errorCode = error && error.code;
  const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
  const execaMessage = `Command ${prefix}: ${command}`;
  const isError = Object.prototype.toString.call(error) === "[object Error]";
  const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
  const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
  if (isError) {
    error.originalMessage = error.message;
    error.message = message;
  } else {
    error = new Error(message);
  }
  error.shortMessage = shortMessage;
  error.command = command;
  error.escapedCommand = escapedCommand;
  error.exitCode = exitCode;
  error.signal = signal;
  error.signalDescription = signalDescription;
  error.stdout = stdout;
  error.stderr = stderr;
  if (all !== void 0) {
    error.all = all;
  }
  if ("bufferedData" in error) {
    delete error.bufferedData;
  }
  error.failed = true;
  error.timedOut = Boolean(timedOut);
  error.isCanceled = isCanceled;
  error.killed = killed && !timedOut;
  return error;
};

// node_modules/execa/lib/stdio.js
var aliases = ["stdin", "stdout", "stderr"];
var hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
var normalizeStdio = (options) => {
  if (!options) {
    return;
  }
  const { stdio } = options;
  if (stdio === void 0) {
    return aliases.map((alias) => options[alias]);
  }
  if (hasAlias(options)) {
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
  }
  if (typeof stdio === "string") {
    return stdio;
  }
  if (!Array.isArray(stdio)) {
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
  }
  const length = Math.max(stdio.length, aliases.length);
  return Array.from({ length }, (value, index) => stdio[index]);
};

// node_modules/execa/lib/kill.js
var import_node_os2 = __toESM(require("os"), 1);
var import_signal_exit = __toESM(require_signal_exit(), 1);
var DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
var spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
  const killResult = kill(signal);
  setKillTimeout(kill, signal, options, killResult);
  return killResult;
};
var setKillTimeout = (kill, signal, options, killResult) => {
  if (!shouldForceKill(signal, options, killResult)) {
    return;
  }
  const timeout = getForceKillAfterTimeout(options);
  const t = setTimeout(() => {
    kill("SIGKILL");
  }, timeout);
  if (t.unref) {
    t.unref();
  }
};
var shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
var isSigterm = (signal) => signal === import_node_os2.default.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
var getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
  if (forceKillAfterTimeout === true) {
    return DEFAULT_FORCE_KILL_TIMEOUT;
  }
  if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
  }
  return forceKillAfterTimeout;
};
var spawnedCancel = (spawned, context) => {
  const killResult = spawned.kill();
  if (killResult) {
    context.isCanceled = true;
  }
};
var timeoutKill = (spawned, signal, reject) => {
  spawned.kill(signal);
  reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
};
var setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
  if (timeout === 0 || timeout === void 0) {
    return spawnedPromise;
  }
  let timeoutId;
  const timeoutPromise = new Promise((resolve2, reject) => {
    timeoutId = setTimeout(() => {
      timeoutKill(spawned, killSignal, reject);
    }, timeout);
  });
  const safeSpawnedPromise = spawnedPromise.finally(() => {
    clearTimeout(timeoutId);
  });
  return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
var validateTimeout = ({ timeout }) => {
  if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
  }
};
var setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
  if (!cleanup || detached) {
    return timedPromise;
  }
  const removeExitHandler = (0, import_signal_exit.default)(() => {
    spawned.kill();
  });
  return timedPromise.finally(() => {
    removeExitHandler();
  });
};

// node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}

// node_modules/execa/lib/stream.js
var import_get_stream = __toESM(require_get_stream(), 1);
var import_merge_stream = __toESM(require_merge_stream(), 1);
var handleInput = (spawned, input) => {
  if (input === void 0 || spawned.stdin === void 0) {
    return;
  }
  if (isStream(input)) {
    input.pipe(spawned.stdin);
  } else {
    spawned.stdin.end(input);
  }
};
var makeAllStream = (spawned, { all }) => {
  if (!all || !spawned.stdout && !spawned.stderr) {
    return;
  }
  const mixed = (0, import_merge_stream.default)();
  if (spawned.stdout) {
    mixed.add(spawned.stdout);
  }
  if (spawned.stderr) {
    mixed.add(spawned.stderr);
  }
  return mixed;
};
var getBufferedData = async (stream, streamPromise) => {
  if (!stream) {
    return;
  }
  stream.destroy();
  try {
    return await streamPromise;
  } catch (error) {
    return error.bufferedData;
  }
};
var getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
  if (!stream || !buffer) {
    return;
  }
  if (encoding) {
    return (0, import_get_stream.default)(stream, { encoding, maxBuffer });
  }
  return import_get_stream.default.buffer(stream, { maxBuffer });
};
var getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
  const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
  const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
  const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
  try {
    return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
  } catch (error) {
    return Promise.all([
      { error, signal: error.signal, timedOut: error.timedOut },
      getBufferedData(stdout, stdoutPromise),
      getBufferedData(stderr, stderrPromise),
      getBufferedData(all, allPromise)
    ]);
  }
};

// node_modules/execa/lib/promise.js
var nativePromisePrototype = (async () => {
})().constructor.prototype;
var descriptors = ["then", "catch", "finally"].map((property) => [
  property,
  Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);
var mergePromise = (spawned, promise) => {
  for (const [property, descriptor] of descriptors) {
    const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
    Reflect.defineProperty(spawned, property, __spreadProps(__spreadValues({}, descriptor), { value }));
  }
  return spawned;
};
var getSpawnedPromise = (spawned) => new Promise((resolve2, reject) => {
  spawned.on("exit", (exitCode, signal) => {
    resolve2({ exitCode, signal });
  });
  spawned.on("error", (error) => {
    reject(error);
  });
  if (spawned.stdin) {
    spawned.stdin.on("error", (error) => {
      reject(error);
    });
  }
});

// node_modules/execa/lib/command.js
var normalizeArgs = (file, args = []) => {
  if (!Array.isArray(args)) {
    return [file];
  }
  return [file, ...args];
};
var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
var DOUBLE_QUOTES_REGEXP = /"/g;
var escapeArg = (arg) => {
  if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }
  return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};
var joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
var getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");

// node_modules/execa/index.js
var DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
var getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
  const env2 = extendEnv ? __spreadValues(__spreadValues({}, import_node_process3.default.env), envOption) : envOption;
  if (preferLocal) {
    return npmRunPathEnv({ env: env2, cwd: localDir, execPath });
  }
  return env2;
};
var handleArguments = (file, args, options = {}) => {
  const parsed = import_cross_spawn.default._parse(file, args, options);
  file = parsed.command;
  args = parsed.args;
  options = parsed.options;
  options = __spreadValues({
    maxBuffer: DEFAULT_MAX_BUFFER,
    buffer: true,
    stripFinalNewline: true,
    extendEnv: true,
    preferLocal: false,
    localDir: options.cwd || import_node_process3.default.cwd(),
    execPath: import_node_process3.default.execPath,
    encoding: "utf8",
    reject: true,
    cleanup: true,
    all: false,
    windowsHide: true
  }, options);
  options.env = getEnv(options);
  options.stdio = normalizeStdio(options);
  if (import_node_process3.default.platform === "win32" && import_node_path2.default.basename(file, ".exe") === "cmd") {
    args.unshift("/q");
  }
  return { file, args, options, parsed };
};
var handleOutput = (options, value, error) => {
  if (typeof value !== "string" && !import_node_buffer.Buffer.isBuffer(value)) {
    return error === void 0 ? void 0 : "";
  }
  if (options.stripFinalNewline) {
    return stripFinalNewline(value);
  }
  return value;
};
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = import_node_child_process.default.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    const dummySpawned = new import_node_child_process.default.ChildProcess();
    const errorPromise = Promise.reject(makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    return mergePromise(dummySpawned, errorPromise);
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options.input);
  spawned.all = makeAllStream(spawned, parsed.options);
  return mergePromise(spawned, handlePromiseOnce);
}

// src/server/apps/hexo/utils.ts
var import_tsyringe9 = require("tsyringe");
var toPost = (post) => post;
var toPage = (post) => post;
var toCategory = (post) => post;
var toTag = (post) => post;
var execLogService = import_tsyringe9.container.resolve(LogService);
execLogService.setScope("exec-service");
async function run(command, args, opt) {
  execLogService.log(`run ${command} ${args.join(" ")}`);
  return (await execa(command, args, __spreadProps(__spreadValues({}, opt), { stdio: "pipe" }))).stdout;
}

// src/server/services/hexo-service.ts
var InvalidPathOptionError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "InvalidPathOptionError";
  }
};
function transformPost(doc) {
  var _a, _b;
  return __spreadProps(__spreadValues({}, doc), {
    slug: doc.slug,
    date: doc == null ? void 0 : doc.date.toString(),
    updated: doc == null ? void 0 : doc.updated.toString(),
    prev: (_a = doc == null ? void 0 : doc.prev) == null ? void 0 : _a.source,
    next: (_b = doc == null ? void 0 : doc.next) == null ? void 0 : _b.source,
    tags: doc.tags.data.map((t) => t.slug),
    categories: doc == null ? void 0 : doc.categories.data.map((c) => c.slug),
    brief: doc._content.slice(0, BRIEF_LENGTH)
  });
}
function transformPostToBrief(doc) {
  const res = __spreadProps(__spreadValues({}, doc), { brief: doc._content.slice(0, BRIEF_LENGTH) });
  delete res._content;
  delete doc.content;
  delete doc.raw;
  return res;
}
function transformPage(doc) {
  var _a, _b;
  return __spreadProps(__spreadValues({}, doc), {
    slug: doc.slug,
    date: doc == null ? void 0 : doc.date.toString(),
    updated: doc == null ? void 0 : doc.updated.toString(),
    prev: (_a = doc == null ? void 0 : doc.prev) == null ? void 0 : _a.source,
    next: (_b = doc == null ? void 0 : doc.next) == null ? void 0 : _b.source,
    brief: doc._content.slice(0, BRIEF_LENGTH)
  });
}
function transformPageToBrief(doc) {
  const res = __spreadProps(__spreadValues({}, doc), { brief: doc._content.slice(0, BRIEF_LENGTH) });
  delete res._content;
  delete res.content;
  delete res.raw;
  return res;
}
var HexoService = class {
  constructor(_logService, _hexoInstanceService) {
    this._logService = _logService;
    this._hexoInstanceService = _hexoInstanceService;
    this._logService.setScope("hexo-service");
  }
  async runWithoutModifiedOption(fn) {
    const { hexo, cleanup } = await this._hexoInstanceService.getInstanceWithOriginOptions();
    await fn(hexo);
    await cleanup();
  }
  async getPostByFullSource(fullSource) {
    const hexo = await this._hexoInstanceService.getInstance();
    const post = hexo.locals.get("posts").toArray().find((item) => item.full_source === fullSource);
    return this.getPostBySource(post.source);
  }
  async getPostOrPageByFullSource(fullSource) {
    const hexo = await this._hexoInstanceService.getInstance();
    const post = hexo.locals.get("posts").toArray().find((item) => item.full_source === fullSource);
    if (post)
      return this.getPostBySource(post.source);
    const page = hexo.locals.get("pages").toArray().find((item) => item.full_source === fullSource);
    return this.getPageBySource(page.source);
  }
  writeFile(fullPath, content) {
    try {
      import_fs3.default.writeFileSync(fullPath, content);
    } catch (e) {
      this._logService.error("fail to write file");
      this._logService.error(e);
      throw new Error("fail to write file");
    }
  }
  deleteFile(fullPath) {
    try {
      import_fs3.default.rmSync(fullPath);
    } catch (e) {
      this._logService.error("fail to delete file");
      this._logService.error(e);
      throw new Error("fail to delete file");
    }
  }
  async getFullPathBySource(source, type) {
    const hexo = await this._hexoInstanceService.getInstance();
    if (type === "post")
      return hexo.locals.get("posts").toArray().find((item) => item.source === source).full_source;
    else
      return hexo.locals.get("pages").toArray().find((item) => item.source === source).full_source;
  }
  async WithCategoriesTagsBriefArticleList(article) {
    const categories = await this.listCategory();
    const tags = await this.listTag();
    const pages = await this.listPage();
    const posts = await this.listPost();
    return { article, categories, tags, pages, posts };
  }
  async listPost() {
    const hexo = await this._hexoInstanceService.getInstance();
    const docs = hexo.locals.get("posts").toArray().map(toPost);
    const res = docs.map((postDoc) => {
      const post = transformPostToBrief(transformPost(postDoc));
      delete post.content;
      delete post._content;
      delete post.raw;
      delete post.more;
      return post;
    });
    this._logService.log("list post", res.length);
    return res;
  }
  async getPostBySource(source) {
    const hexo = await this._hexoInstanceService.getInstance();
    const docs = hexo.locals.get("posts").toArray().map(toPost);
    const doc = docs.find((item) => item.source === source);
    if (!doc)
      throw new Error("not found");
    const res = transformPost(doc);
    this._logService.log("get post by source", source);
    return res;
  }
  async listPage() {
    const hexo = await this._hexoInstanceService.getInstance();
    const docs = hexo.locals.get("pages").toArray().map(toPage);
    const res = docs.map((pageDoc) => {
      const page = transformPageToBrief(transformPage(pageDoc));
      delete page.content;
      delete page._content;
      delete page.raw;
      delete page.more;
      return page;
    });
    this._logService.log("list page", res.length);
    return res;
  }
  async getPageBySource(source) {
    const hexo = await this._hexoInstanceService.getInstance();
    const docs = hexo.locals.get("pages").toArray().map(toPage);
    const doc = docs.find((item) => item.source === source);
    if (!doc)
      throw new Error("not found");
    const res = transformPage(doc);
    this._logService.log("get page by source", source);
    return res;
  }
  async listCategory() {
    const hexo = await this._hexoInstanceService.getInstance();
    const docs = hexo.locals.get("categories").toArray().map(toCategory);
    const res = docs.map((categoryDoc) => __spreadProps(__spreadValues({}, categoryDoc), {
      posts: categoryDoc.posts.map((p) => p.slug)
    }));
    this._logService.log("list category", res.length);
    return res;
  }
  async listTag() {
    const hexo = await this._hexoInstanceService.getInstance();
    const docs = hexo.locals.get("tags").toArray().map(toTag);
    const res = docs.map((tagDoc) => __spreadProps(__spreadValues({}, tagDoc), {
      posts: tagDoc.posts.map((p) => p.slug)
    }));
    this._logService.log("list tag", res.length);
    return res;
  }
  async deploy(options = {}) {
    const { generate = false } = options;
    const args = [];
    if (generate)
      args.push("--generate");
    this.runWithoutModifiedOption(async (hexo) => {
      await hexo.call("deploy", { _: args });
      await hexo.exit();
    });
    this._logService.log(`run hexo deploy with args:`, args.join(" "));
  }
  async generate(options = {}) {
    const {
      deploy = false,
      watch = false,
      bail = false,
      force = false,
      concurrency = false
    } = options;
    const args = [];
    if (deploy)
      args.push("--deploy");
    if (watch)
      args.push("--watch");
    if (bail)
      args.push("--bail");
    if (force)
      args.push("--force");
    this.runWithoutModifiedOption(async (hexo) => {
      if (concurrency)
        args.push("--concurrency");
      await hexo.call("generate", { _: args });
      await hexo.exit();
    });
    this._logService.log(`run hexo generate with args:`, args.join(" "));
  }
  async clean() {
    this.runWithoutModifiedOption(async (hexo) => {
      await hexo.call("clean");
      await hexo.exit();
    });
    this._logService.log("run hexo clean");
  }
  async publish(filename, layout) {
    const args = ["publish"];
    if (layout)
      args.push(layout);
    args.push(filename);
    const info = await run("hexo", args, {
      cwd: await this._hexoInstanceService.getBaseDir()
    });
    const fullSource = expandHomeDir(info.split("Published: ")[1].trim());
    const article = await this.getPostByFullSource(fullSource);
    const res = this.WithCategoriesTagsBriefArticleList(article);
    this._logService.log(`publish ${filename} with layout: ${layout}`);
    return res;
  }
  async create(title, options) {
    const args = ["new"];
    if (options.layout)
      args.push(options.layout);
    if (options.path) {
      try {
        const base = await this._hexoInstanceService.getBaseDir();
        const fullPath = import_path5.default.resolve(base, options.path);
        const relative = import_path5.default.relative(fullPath, base);
        if (!relative.startsWith("..")) {
          this._logService.error(`${fullPath} is not valid`);
          throw new Error();
        }
      } catch (err) {
        throw new InvalidPathOptionError(err.message);
      }
      args.push("--path");
      args.push(options.path);
    }
    if (options.replace)
      args.push("--replace");
    if (options.slug) {
      args.push("--slug");
      args.push(options.slug);
    }
    if (title)
      args.push(title);
    const info = await this._hexoInstanceService.runBetweenReload(async () => {
      return await run("hexo", args, {
        cwd: await this._hexoInstanceService.getBaseDir()
      });
    });
    const fullSource = expandHomeDir(info.split("Created: ")[1].trim());
    const article = await this.getPostOrPageByFullSource(fullSource);
    const res = this.WithCategoriesTagsBriefArticleList(article);
    this._logService.log("create succeed", fullSource);
    return res;
  }
  async update(source, raw, type) {
    const fullPath = await this.getFullPathBySource(source, type);
    if (!fullPath)
      throw new Error("not found");
    this._hexoInstanceService.runBetweenReload(() => {
      this.writeFile(fullPath, raw);
    });
    const article = await this.getPostBySource(source);
    return this.WithCategoriesTagsBriefArticleList(article);
  }
  async delete(source, type) {
    const fullPath = await this.getFullPathBySource(source, type);
    if (!fullPath)
      throw new Error("not found");
    await this._hexoInstanceService.runBetweenReload(async () => {
      await this.deleteFile(fullPath);
    });
    return this.WithCategoriesTagsBriefArticleList(null);
  }
};
HexoService = __decorateClass([
  (0, import_tsyringe10.injectable)(),
  (0, import_tsyringe10.singleton)(),
  __decorateParam(0, (0, import_tsyringe10.inject)(LogService)),
  __decorateParam(1, (0, import_tsyringe10.inject)(HexoInstanceService))
], HexoService);

// src/server/routers/hexo-router.ts
var router3 = new import_router4.default();
router3.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HexoCoreInitError) {
      ctx.status = 500;
      ctx.body = {
        code: import_typedef.ERROR_CODE.E_INIT,
        message: err.message
      };
    } else if (err instanceof HexoCoreInitiatingError) {
      ctx.status = 503;
      ctx.body = {
        code: import_typedef.ERROR_CODE.E_INITIATING,
        message: "hexo core initiating please wait for a second"
      };
    } else if (err instanceof InvalidPathOptionError) {
      ctx.status = 400;
      ctx.body = {
        code: import_typedef.ERROR_CODE.E_INVALID_CREATE_OPTION_PATH,
        message: "hexo core initiating please wait for a second"
      };
    } else if (err instanceof Error && err.message === "not found") {
      ctx.status = 404;
      ctx.body = {
        code: import_typedef.ERROR_CODE.E_NOT_FOUND,
        message: "not found"
      };
    } else
      throw err;
  }
});
router3.get("/posts", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  ctx.body = await hexo.listPost();
});
router3.get("/post/:source", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source`";
  }
  ctx.body = await hexo.getPostBySource(decodeURIComponent(source));
});
router3.get("/pages", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  ctx.body = await hexo.listPage();
});
router3.get("/page/:source", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source`";
  }
  ctx.body = await hexo.getPageBySource(decodeURIComponent(source));
});
router3.get("/tags", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  ctx.body = await hexo.listTag();
});
router3.get("/categories", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  ctx.body = await hexo.listCategory();
});
router3.post("/deploy", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  await hexo.deploy(ctx.request.body);
  ctx.status = 200;
});
router3.post("/generate", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  await hexo.generate(ctx.request.body);
  ctx.status = 200;
});
router3.post("/clean", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  await hexo.clean();
  ctx.status = 200;
});
router3.post("/publish", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { filename, layout } = ctx.request.body;
  if (!filename) {
    ctx.status = 400;
    ctx.body = "need `filename`";
    return;
  }
  ctx.body = await hexo.publish(filename, layout);
});
router3.post("/create", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { title, layout, path: path8, slug, replace } = ctx.request.body;
  if (!title) {
    ctx.status = 400;
    ctx.body = "need `title`";
    return;
  }
  ctx.body = await hexo.create(title, { layout, path: path8, slug, replace });
});
router3.put("/post/:source", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { source } = ctx.params;
  const { raw } = ctx.request.body;
  if (!source || !raw) {
    ctx.status = 400;
    ctx.body = "need `source` and `raw`";
    return;
  }
  ctx.body = await hexo.update(source, raw, "post");
});
router3.put("/page/:source", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { source } = ctx.params;
  const { raw } = ctx.request.body;
  if (!source || !raw) {
    ctx.status = 400;
    ctx.body = "need `source` and `raw`";
    return;
  }
  ctx.body = await hexo.update(source, raw, "page");
});
router3.delete("/post/:source", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source` ";
    return;
  }
  ctx.body = await hexo.delete(source, "post");
});
router3.delete("/page/:source", async (ctx) => {
  const hexo = import_tsyringe11.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source` ";
    return;
  }
  ctx.body = await hexo.delete(source, "page");
});
var hexo_router_default = router3;

// src/server/apps/hexo/index.ts
var app3 = new import_koa3.default();
app3.use(hexo_router_default.routes());
app3.use(hexo_router_default.allowedMethods());
var hexo_default = app3;

// src/server/apps/git/index.ts
var import_koa4 = __toESM(require("koa"));

// src/server/apps/git/router.ts
var import_tsyringe13 = require("tsyringe");
var import_router5 = __toESM(require("@koa/router"));

// src/server/services/git-service.ts
var import_tsyringe12 = require("tsyringe");

// src/server/apps/git/errors.ts
var ResetHardError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "ResetHardError";
  }
};
var PullError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "PullError";
  }
};
var AddAllError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "AddAllError";
  }
};
var CreateCommitError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "CreateCommitError";
  }
};
var PushError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "PushError";
  }
};

// src/server/services/git-service.ts
async function isClean(repoPath) {
  return !await run("git", ["status", "-s"], { cwd: repoPath });
}
async function hasRepo(repoPath) {
  return run("git", ["rev-parse", "--is-inside-work-tree"], {
    cwd: repoPath
  }).then(() => true, () => false);
}
async function hasRemtoe(repoPath) {
  return !!await run("git", ["remote", "-v"], { cwd: repoPath });
}
var GitService = class {
  constructor(storage2, _logService) {
    this.storage = storage2;
    this._logService = _logService;
    this._logService.setScope("git-service");
  }
  async sync() {
    const base = this.storage.get(HEXO_BASE_DIR_KEY);
    const cwd = toRealPath(base);
    if (!await hasRepo(cwd)) {
      this._logService.log("not git repo, skipped");
      return;
    }
    await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
      this._logService.error(err);
      this._logService.error("git reset hard error");
      throw new ResetHardError();
    });
    this._logService.log("git reset succeed");
    if (await hasRemtoe(cwd)) {
      await run("git", ["pull"], { cwd }).catch((err) => {
        console.error(err);
        throw new PullError();
      });
    } else {
      this._logService.log("no remote detected, skip pull");
    }
    this._logService.log("sync succeed");
  }
  async save() {
    const base = this.storage.get(HEXO_BASE_DIR_KEY);
    const cwd = toRealPath(base);
    if (!await hasRepo(cwd)) {
      this._logService.log("not git repo, skipped");
      return;
    }
    if (await isClean(cwd)) {
      this._logService.log("work space clean no need to save");
      return;
    }
    await run("git", ["add", ".", "--all"], { cwd }).catch((err) => {
      this._logService.error(err);
      this._logService.error("git add all error");
      throw new AddAllError();
    });
    this._logService.log("git add succeed");
    await run("git", ["commit", "-m", `server update ${new Date().toString()}`], { cwd }).catch((err) => {
      this._logService.error(err);
      this._logService.error("git commit error");
      throw new CreateCommitError();
    });
    this._logService.log("git commit succeed");
    if (await hasRemtoe(cwd)) {
      await run("git", ["push"], { cwd }).catch((err) => {
        this._logService.error(err);
        this._logService.error("git push error");
        throw new PushError();
      });
    } else {
      this._logService.log("no remote detected, skip push");
    }
    this._logService.log("save succeed");
  }
};
GitService = __decorateClass([
  (0, import_tsyringe12.injectable)(),
  (0, import_tsyringe12.singleton)(),
  __decorateParam(0, (0, import_tsyringe12.inject)(StorageService)),
  __decorateParam(1, (0, import_tsyringe12.inject)(LogService))
], GitService);

// src/server/apps/git/router.ts
var router4 = new import_router5.default();
router4.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if ([
      "RepoOpenError",
      "ResetHardError",
      "PullError",
      "AddAllError",
      "CreateCommitError",
      "PushError"
    ].includes(err)) {
      ctx.status = 500;
      ctx.body = err.name;
      return;
    }
    throw err;
  }
});
router4.post("/sync", async (ctx) => {
  const git = import_tsyringe13.container.resolve(GitService);
  await git.sync();
  ctx.status = 200;
});
router4.post("/save", async (ctx) => {
  const git = import_tsyringe13.container.resolve(GitService);
  await git.save();
  ctx.status = 200;
});
var router_default2 = router4;

// src/server/apps/git/index.ts
var app4 = new import_koa4.default();
app4.use(router_default2.routes());
app4.use(router_default2.allowedMethods());
var git_default = app4;

// src/server/routers/settings-router.ts
var import_tsyringe15 = require("tsyringe");
var import_router7 = __toESM(require("@koa/router"));

// src/server/services/settings-service.ts
var import_tsyringe14 = require("tsyringe");
var SettingsService = class {
  constructor(_storageService) {
    this._storageService = _storageService;
  }
  async get() {
    return this._storageService.get(SettingsService.KEY) || {};
  }
  async set(settings) {
    this._storageService.set(SettingsService.KEY, settings);
  }
};
SettingsService.KEY = "settings";
SettingsService = __decorateClass([
  (0, import_tsyringe14.injectable)(),
  (0, import_tsyringe14.singleton)(),
  __decorateParam(0, (0, import_tsyringe14.inject)(StorageService))
], SettingsService);

// src/server/routers/settings-router.ts
var router5 = new import_router7.default();
router5.get("/settings", async (ctx) => {
  const settingsService = import_tsyringe15.container.resolve(SettingsService);
  ctx.body = await settingsService.get();
});
router5.post("/settings", async (ctx) => {
  var _a;
  const settingsService = import_tsyringe15.container.resolve(SettingsService);
  const settings = (_a = ctx.request.body) != null ? _a : {};
  await settingsService.set(settings);
  ctx.status = 200;
});
var settings_router_default = router5;

// src/server/routers/template.ts
var import_router8 = __toESM(require("@koa/router"));
var import_tsyringe17 = require("tsyringe");

// ../typedef/src/index.ts
function createErrorResponse(code, message) {
  return { code, message };
}

// src/server/services/frontmatter-template-service.ts
var import_tsyringe16 = require("tsyringe");
var FrontmatterTemplateService = class {
  constructor(_storageService) {
    this._storageService = _storageService;
  }
  _list() {
    return this._storageService.get(FrontmatterTemplateService.KEY) || [];
  }
  _set(items) {
    this._storageService.set(FrontmatterTemplateService.KEY, items);
  }
  async list() {
    return this._list();
  }
  async set(items) {
    this._set(items);
  }
};
FrontmatterTemplateService.KEY = "frontmatter-template";
FrontmatterTemplateService = __decorateClass([
  (0, import_tsyringe16.injectable)(),
  (0, import_tsyringe16.singleton)(),
  __decorateParam(0, (0, import_tsyringe16.inject)(StorageService))
], FrontmatterTemplateService);

// src/server/routers/template.ts
var router6 = new import_router8.default();
router6.prefix("/template");
router6.get("/frontmatter", async (ctx) => {
  const frontmatterTemplateService = import_tsyringe17.container.resolve(FrontmatterTemplateService);
  const items = await frontmatterTemplateService.list();
  ctx.body = { items };
});
router6.post("/frontmatter", async (ctx) => {
  var _a;
  const items = (_a = ctx.request.body) == null ? void 0 : _a.items;
  if (!items) {
    ctx.status = 400;
    ctx.body = createErrorResponse(5 /* E_BAD_REQUEST */, "`raw` is required");
    return;
  }
  const frontmatterTemplateService = import_tsyringe17.container.resolve(FrontmatterTemplateService);
  await frontmatterTemplateService.set(items);
  ctx.status = 200;
  ctx.body = { message: "OK" };
});
var template_default = router6;

const auth = koaAuthentication.createAuth({
    verify(username, password) {
        const account = tsyringe.container.resolve(AccountService);
        account.verify(username, password);
    },
    secret() {
        return tsyringe.container.resolve(AuthStorageService).getSecret();
    },
});
auth.router.post("/password", auth.auth, (ctx) => {
    const account = tsyringe.container.resolve(AccountService);
    const { oldPassword, password } = ctx.request.body;
    account.verify(ctx.state.user.username, oldPassword);
    account.setPassword(password);
    ctx.status = 200;
});
auth.router.post("/username", auth.auth, (ctx, next) => {
    const account = tsyringe.container.resolve(AccountService);
    const { username } = ctx.request.body;
    account.setUsername(username);
    ctx.state.user.username = username;
    return next();
}, auth.cookie, (ctx) => (ctx.status = 200));

/**
 * config app entrance
 */
var apps = compose__default["default"]([
    mount__default["default"]("/install", app$4),
    checkInstall(),
    auth.auth,
    mount__default["default"]("/health", app$3),
    mount__default["default"]("/hexo", app$2),
    mount__default["default"]("/git", app$1),
    router$1.routes(),
    router.routes(),
]);

// src/server/lib/http-secure.ts
var import_crypto = __toESM(require("crypto"));
var import_crypto_js2 = __toESM(require("crypto-js"));
var import_node_jsencrypt = __toESM(require("node-jsencrypt"));
function secure(enable = () => true) {
  const { publicKey, privateKey } = import_crypto.default.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem"
    }
  });
  function decryptRSA(data) {
    const o = new import_node_jsencrypt.default();
    o.setPrivateKey(privateKey);
    const res = o.decrypt(data);
    return res;
  }
  function decryptAES(data, key) {
    return import_crypto_js2.default.AES.decrypt(data, key).toString(import_crypto_js2.default.enc.Utf8);
  }
  function encryptAES(data, key) {
    return import_crypto_js2.default.AES.encrypt(data, key).toString();
  }
  import_crypto_js2.default.AES.encrypt('"hi"', "123").toString();
  function isGetPublicKeyRoute(ctx) {
    return ctx.request.path.startsWith("/publickey") && ctx.request.method === "GET";
  }
  function stringifyData(data) {
    return JSON.stringify(data);
  }
  function parseData(data) {
    const str = data;
    return JSON.parse(str);
  }
  return async (ctx, next) => {
    if (typeof enable === "function" ? !enable() : !enable) {
      await next();
      return;
    }
    if (isGetPublicKeyRoute(ctx)) {
      console.log(source_default.white("GET"), source_default.white.dim("/publickey"));
      ctx.body = publicKey;
      return;
    }
    const prefix = "/secure/";
    const enced = decodeURIComponent(ctx.path.slice(prefix.length));
    const secured = ctx.path.startsWith(prefix);
    if (secured) {
      const res = decryptRSA(enced);
      if (!res) {
        ctx.status = 403;
        ctx.body = { code: "EHTTPSECURE" };
        return;
      }
      const decoded = JSON.parse(res);
      ctx.path = decoded.url;
      const key = decoded.key;
      ctx.originalUrl = "[secure]" + ctx.path;
      ctx.request.body = ctx.request.method !== "GET" && parseData(decryptAES(ctx.request.body.content, key)).data;
      await next();
      const content = encryptAES(stringifyData({ data: ctx.body }), key);
      ctx.body = { content };
    } else {
      await next();
      return;
    }
  };
}
var http_secure_default = secure;

// src/server/apps/statics.ts
var import_path6 = __toESM(require("path"));
var import_koa_static = __toESM(require("koa-static"));
var ROOT = import_path6.default.resolve(process.cwd(), "../web/dist");
var statics = (0, import_koa_static.default)(ROOT, {
  setHeaders: (res, fullpath) => {
    const isHtml = import_path6.default.extname(fullpath).toLowerCase() === ".html";
    if (isHtml)
      res.setHeader("Cache-Control", "no-cache");
    else
      res.setHeader("Cache-Control", "max-age=31536000");
  }
});

// src/server/middlewares/auth.ts
var import_koa_authentication = require("@winwin/koa-authentication");
var import_tsyringe18 = require("tsyringe");
var auth = (0, import_koa_authentication.createAuth)({
  verify(username, password) {
    const account = import_tsyringe18.container.resolve(AccountService);
    account.verify(username, password);
  },
  secret() {
    return import_tsyringe18.container.resolve(AuthStorageService).getSecret();
  }
});
auth.router.post("/password", auth.auth, (ctx) => {
  const account = import_tsyringe18.container.resolve(AccountService);
  const { oldPassword, password } = ctx.request.body;
  account.verify(ctx.state.user.username, oldPassword);
  account.setPassword(password);
  ctx.status = 200;
});
auth.router.post("/username", auth.auth, (ctx, next) => {
  const account = import_tsyringe18.container.resolve(AccountService);
  const { username } = ctx.request.body;
  account.setUsername(username);
  ctx.state.user.username = username;
  return next();
}, auth.cookie, (ctx) => ctx.status = 200);

const app = new Koa__default["default"]();
app.use(cors__default["default"]());
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 500) {
            ctx.body = { message: DEV ? err : "server internal error" };
            console.error(err);
        }
        else
            ctx.body = { message: err.message };
    }
}));
app.use(bodyParser__default["default"]({
    enableTypes: ["json", "form", "text"],
}));
app.use(secure());
app.use(logger__default["default"]());
app.use(compress__default["default"]());
app.use(mount__default["default"]("/", statics));
app.use(auth.router.routes());
app.use(apps);

const storage = tsyringe.container.resolve(StorageService);
const server = http__default["default"].createServer(app.callback());
server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
    console.log("Server running on " + bind);
    const his = tsyringe.container.resolve(HexoInstanceService);
    his.init();
});
server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT);
