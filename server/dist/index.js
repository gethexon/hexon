var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// ../../node_modules/isexe/windows.js
var require_windows = __commonJS({
  "../../node_modules/isexe/windows.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs3 = require("fs");
    function checkPathExt(path8, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path8.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path8, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path8, options);
    }
    function isexe(path8, options, cb) {
      fs3.stat(path8, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path8, options));
      });
    }
    function sync(path8, options) {
      return checkStat(fs3.statSync(path8), path8, options);
    }
  }
});

// ../../node_modules/isexe/mode.js
var require_mode = __commonJS({
  "../../node_modules/isexe/mode.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs3 = require("fs");
    function isexe(path8, options, cb) {
      fs3.stat(path8, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path8, options) {
      return checkStat(fs3.statSync(path8), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// ../../node_modules/isexe/index.js
var require_isexe = __commonJS({
  "../../node_modules/isexe/index.js"(exports, module2) {
    var fs3 = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path8, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve4, reject) {
          isexe(path8, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve4(is);
            }
          });
        });
      }
      core(path8, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path8, options) {
      try {
        return core.sync(path8, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// ../../node_modules/which/which.js
var require_which = __commonJS({
  "../../node_modules/which/which.js"(exports, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path8 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve4, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve4(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path8.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve4(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve4, reject) => {
        if (ii === pathExt.length)
          return resolve4(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve4(p + ext);
          }
          return resolve4(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path8.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// ../../node_modules/path-key/index.js
var require_path_key = __commonJS({
  "../../node_modules/path-key/index.js"(exports, module2) {
    "use strict";
    var pathKey2 = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey2;
    module2.exports.default = pathKey2;
  }
});

// ../../node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "../../node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module2) {
    "use strict";
    var path8 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env2 = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env2[getPathKey({ env: env2 })],
          pathExt: withoutPathExt ? path8.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path8.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// ../../node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "../../node_modules/cross-spawn/lib/util/escape.js"(exports, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(\\*)"/g, '$1$1\\"');
      arg = arg.replace(/(\\*)$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// ../../node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "../../node_modules/shebang-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// ../../node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "../../node_modules/shebang-command/index.js"(exports, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path8, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path8.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// ../../node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "../../node_modules/cross-spawn/lib/util/readShebang.js"(exports, module2) {
    "use strict";
    var fs3 = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs3.openSync(command, "r");
        fs3.readSync(fd, buffer, 0, size, 0);
        fs3.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// ../../node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/cross-spawn/lib/parse.js"(exports, module2) {
    "use strict";
    var path8 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path8.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// ../../node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "../../node_modules/cross-spawn/lib/enoent.js"(exports, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// ../../node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "../../node_modules/cross-spawn/index.js"(exports, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// ../../node_modules/execa/node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "../../node_modules/execa/node_modules/signal-exit/signals.js"(exports, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    }
    if (process.platform === "linux") {
      module2.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
    }
  }
});

// ../../node_modules/execa/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "../../node_modules/execa/node_modules/signal-exit/index.js"(exports, module2) {
    var process5 = global.process;
    var processOk = function(process6) {
      return process6 && typeof process6 === "object" && typeof process6.removeListener === "function" && typeof process6.emit === "function" && typeof process6.reallyExit === "function" && typeof process6.listeners === "function" && typeof process6.kill === "function" && typeof process6.pid === "number" && typeof process6.on === "function";
    };
    if (!processOk(process5)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process5.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process5.__signal_exit_emitter__) {
        emitter = process5.__signal_exit_emitter__;
      } else {
        emitter = process5.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process5.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process5.emit = originalProcessEmit;
        process5.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process5.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process5.kill(process5.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process5.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process5.emit = processEmit;
        process5.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process5.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process5.exitCode = code || 0;
        emit("exit", process5.exitCode, null);
        emit("afterexit", process5.exitCode, null);
        originalProcessReallyExit.call(process5, process5.exitCode);
      };
      originalProcessEmit = process5.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process5.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process5.exitCode, null);
          emit("afterexit", process5.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// ../../node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "../../node_modules/get-stream/buffer-stream.js"(exports, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = require("stream");
    module2.exports = (options) => {
      options = __spreadValues({}, options);
      const { array } = options;
      let { encoding } = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// ../../node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "../../node_modules/get-stream/index.js"(exports, module2) {
    "use strict";
    var { constants: BufferConstants } = require("buffer");
    var stream = require("stream");
    var { promisify } = require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify(stream.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream2(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = __spreadValues({
        maxBuffer: Infinity
      }, options);
      const { maxBuffer } = options;
      const stream2 = bufferStream(options);
      await new Promise((resolve4, reject) => {
        const rejectPromise = (error) => {
          if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream2.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream2);
            resolve4();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream2.on("data", () => {
          if (stream2.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream2.getBufferedValue();
    }
    module2.exports = getStream2;
    module2.exports.buffer = (stream2, options) => getStream2(stream2, __spreadProps(__spreadValues({}, options), { encoding: "buffer" }));
    module2.exports.array = (stream2, options) => getStream2(stream2, __spreadProps(__spreadValues({}, options), { array: true }));
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// ../../node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "../../node_modules/merge-stream/index.js"(exports, module2) {
    "use strict";
    var { PassThrough } = require("stream");
    module2.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// ../../node_modules/@vue/shared/dist/shared.cjs.prod.js
var require_shared_cjs_prod = __commonJS({
  "../../node_modules/@vue/shared/dist/shared.cjs.prod.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeMap(str, expectsLowerCase) {
      const map = /* @__PURE__ */ Object.create(null);
      const list = str.split(",");
      for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
    }
    var PatchFlagNames = {
      [1]: `TEXT`,
      [2]: `CLASS`,
      [4]: `STYLE`,
      [8]: `PROPS`,
      [16]: `FULL_PROPS`,
      [32]: `HYDRATE_EVENTS`,
      [64]: `STABLE_FRAGMENT`,
      [128]: `KEYED_FRAGMENT`,
      [256]: `UNKEYED_FRAGMENT`,
      [512]: `NEED_PATCH`,
      [1024]: `DYNAMIC_SLOTS`,
      [2048]: `DEV_ROOT_FRAGMENT`,
      [-1]: `HOISTED`,
      [-2]: `BAIL`
    };
    var slotFlagsText = {
      [1]: "STABLE",
      [2]: "DYNAMIC",
      [3]: "FORWARDED"
    };
    var GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
    var isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
    var range = 2;
    function generateCodeFrame(source, start = 0, end = source.length) {
      let lines = source.split(/(\r?\n)/);
      const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
      lines = lines.filter((_, idx) => idx % 2 === 0);
      let count = 0;
      const res = [];
      for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
        if (count >= start) {
          for (let j = i - range; j <= i + range || end > count; j++) {
            if (j < 0 || j >= lines.length)
              continue;
            const line = j + 1;
            res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
            const lineLength = lines[j].length;
            const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
            if (j === i) {
              const pad = start - (count - (lineLength + newLineSeqLength));
              const length = Math.max(1, end > count ? lineLength - pad : end - start);
              res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
            } else if (j > i) {
              if (end > count) {
                const length = Math.max(Math.min(end - count, lineLength), 1);
                res.push(`   |  ` + "^".repeat(length));
              }
              count += lineLength + newLineSeqLength;
            }
          }
          break;
        }
      }
      return res.join("\n");
    }
    var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
    var isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
    function includeBooleanAttr(value) {
      return !!value || value === "";
    }
    var unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
    var attrValidationCache = {};
    function isSSRSafeAttrName(name) {
      if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
      }
      const isUnsafe = unsafeAttrCharRE.test(name);
      if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
      }
      return attrValidationCache[name] = !isUnsafe;
    }
    var propsToAttrMap = {
      acceptCharset: "accept-charset",
      className: "class",
      htmlFor: "for",
      httpEquiv: "http-equiv"
    };
    var isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
    var isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
    var isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
    function normalizeStyle(value) {
      if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
          if (normalized) {
            for (const key in normalized) {
              res[key] = normalized[key];
            }
          }
        }
        return res;
      } else if (isString(value)) {
        return value;
      } else if (isObject(value)) {
        return value;
      }
    }
    var listDelimiterRE = /;(?![^(]*\))/g;
    var propertyDelimiterRE = /:(.+)/;
    function parseStringStyle(cssText) {
      const ret = {};
      cssText.split(listDelimiterRE).forEach((item) => {
        if (item) {
          const tmp = item.split(propertyDelimiterRE);
          tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return ret;
    }
    function stringifyStyle(styles2) {
      let ret = "";
      if (!styles2 || isString(styles2)) {
        return ret;
      }
      for (const key in styles2) {
        const value = styles2[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
          ret += `${normalizedKey}:${value};`;
        }
      }
      return ret;
    }
    function normalizeClass(value) {
      let res = "";
      if (isString(value)) {
        res = value;
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i]);
          if (normalized) {
            res += normalized + " ";
          }
        }
      } else if (isObject(value)) {
        for (const name in value) {
          if (value[name]) {
            res += name + " ";
          }
        }
      }
      return res.trim();
    }
    function normalizeProps(props) {
      if (!props)
        return null;
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (style) {
        props.style = normalizeStyle(style);
      }
      return props;
    }
    var HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
    var SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
    var VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
    var isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
    var isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
    var isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
    var escapeRE = /["'&<>]/;
    function escapeHtml(string) {
      const str = "" + string;
      const match = escapeRE.exec(str);
      if (!match) {
        return str;
      }
      let html = "";
      let escaped;
      let index;
      let lastIndex = 0;
      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            escaped = "&quot;";
            break;
          case 38:
            escaped = "&amp;";
            break;
          case 39:
            escaped = "&#39;";
            break;
          case 60:
            escaped = "&lt;";
            break;
          case 62:
            escaped = "&gt;";
            break;
          default:
            continue;
        }
        if (lastIndex !== index) {
          html += str.slice(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
      }
      return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
    }
    var commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
    function escapeHtmlComment(src) {
      return src.replace(commentStripRE, "");
    }
    function looseCompareArrays(a, b) {
      if (a.length !== b.length)
        return false;
      let equal = true;
      for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
      }
      return equal;
    }
    function looseEqual(a, b) {
      if (a === b)
        return true;
      let aValidType = isDate(a);
      let bValidType = isDate(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
      }
      aValidType = isArray(a);
      bValidType = isArray(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
      }
      aValidType = isObject(a);
      bValidType = isObject(b);
      if (aValidType || bValidType) {
        if (!aValidType || !bValidType) {
          return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
          return false;
        }
        for (const key in a) {
          const aHasKey = a.hasOwnProperty(key);
          const bHasKey = b.hasOwnProperty(key);
          if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
            return false;
          }
        }
      }
      return String(a) === String(b);
    }
    function looseIndexOf(arr, val) {
      return arr.findIndex((item) => looseEqual(item, val));
    }
    var toDisplayString = (val) => {
      return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
    };
    var replacer = (_key, val) => {
      if (val && val.__v_isRef) {
        return replacer(_key, val.value);
      } else if (isMap(val)) {
        return {
          [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
            entries[`${key} =>`] = val2;
            return entries;
          }, {})
        };
      } else if (isSet(val)) {
        return {
          [`Set(${val.size})`]: [...val.values()]
        };
      } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
      }
      return val;
    };
    var EMPTY_OBJ = {};
    var EMPTY_ARR = [];
    var NOOP = () => {
    };
    var NO = () => false;
    var onRE = /^on[^a-z]/;
    var isOn = (key) => onRE.test(key);
    var isModelListener = (key) => key.startsWith("onUpdate:");
    var extend = Object.assign;
    var remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasOwn = (val, key) => hasOwnProperty.call(val, key);
    var isArray = Array.isArray;
    var isMap = (val) => toTypeString(val) === "[object Map]";
    var isSet = (val) => toTypeString(val) === "[object Set]";
    var isDate = (val) => val instanceof Date;
    var isFunction = (val) => typeof val === "function";
    var isString = (val) => typeof val === "string";
    var isSymbol = (val) => typeof val === "symbol";
    var isObject = (val) => val !== null && typeof val === "object";
    var isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
    };
    var objectToString = Object.prototype.toString;
    var toTypeString = (value) => objectToString.call(value);
    var toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    var isPlainObject = (val) => toTypeString(val) === "[object Object]";
    var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
    var isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
    var cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    var camelizeRE = /-(\w)/g;
    var camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    });
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
    var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
    var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
    var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
    var invokeArrayFns = (fns, arg) => {
      for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
      }
    };
    var def = (obj, key, value) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
      });
    };
    var toNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
    };
    var _globalThis;
    var getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    exports.EMPTY_ARR = EMPTY_ARR;
    exports.EMPTY_OBJ = EMPTY_OBJ;
    exports.NO = NO;
    exports.NOOP = NOOP;
    exports.PatchFlagNames = PatchFlagNames;
    exports.camelize = camelize;
    exports.capitalize = capitalize;
    exports.def = def;
    exports.escapeHtml = escapeHtml;
    exports.escapeHtmlComment = escapeHtmlComment;
    exports.extend = extend;
    exports.generateCodeFrame = generateCodeFrame;
    exports.getGlobalThis = getGlobalThis;
    exports.hasChanged = hasChanged;
    exports.hasOwn = hasOwn;
    exports.hyphenate = hyphenate;
    exports.includeBooleanAttr = includeBooleanAttr;
    exports.invokeArrayFns = invokeArrayFns;
    exports.isArray = isArray;
    exports.isBooleanAttr = isBooleanAttr;
    exports.isBuiltInDirective = isBuiltInDirective;
    exports.isDate = isDate;
    exports.isFunction = isFunction;
    exports.isGloballyWhitelisted = isGloballyWhitelisted;
    exports.isHTMLTag = isHTMLTag;
    exports.isIntegerKey = isIntegerKey;
    exports.isKnownHtmlAttr = isKnownHtmlAttr;
    exports.isKnownSvgAttr = isKnownSvgAttr;
    exports.isMap = isMap;
    exports.isModelListener = isModelListener;
    exports.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
    exports.isObject = isObject;
    exports.isOn = isOn;
    exports.isPlainObject = isPlainObject;
    exports.isPromise = isPromise;
    exports.isReservedProp = isReservedProp;
    exports.isSSRSafeAttrName = isSSRSafeAttrName;
    exports.isSVGTag = isSVGTag;
    exports.isSet = isSet;
    exports.isSpecialBooleanAttr = isSpecialBooleanAttr;
    exports.isString = isString;
    exports.isSymbol = isSymbol;
    exports.isVoidTag = isVoidTag;
    exports.looseEqual = looseEqual;
    exports.looseIndexOf = looseIndexOf;
    exports.makeMap = makeMap;
    exports.normalizeClass = normalizeClass;
    exports.normalizeProps = normalizeProps;
    exports.normalizeStyle = normalizeStyle;
    exports.objectToString = objectToString;
    exports.parseStringStyle = parseStringStyle;
    exports.propsToAttrMap = propsToAttrMap;
    exports.remove = remove;
    exports.slotFlagsText = slotFlagsText;
    exports.stringifyStyle = stringifyStyle;
    exports.toDisplayString = toDisplayString;
    exports.toHandlerKey = toHandlerKey;
    exports.toNumber = toNumber;
    exports.toRawType = toRawType;
    exports.toTypeString = toTypeString;
  }
});

// ../../node_modules/@vue/shared/dist/shared.cjs.js
var require_shared_cjs = __commonJS({
  "../../node_modules/@vue/shared/dist/shared.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeMap(str, expectsLowerCase) {
      const map = /* @__PURE__ */ Object.create(null);
      const list = str.split(",");
      for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
    }
    var PatchFlagNames = {
      [1]: `TEXT`,
      [2]: `CLASS`,
      [4]: `STYLE`,
      [8]: `PROPS`,
      [16]: `FULL_PROPS`,
      [32]: `HYDRATE_EVENTS`,
      [64]: `STABLE_FRAGMENT`,
      [128]: `KEYED_FRAGMENT`,
      [256]: `UNKEYED_FRAGMENT`,
      [512]: `NEED_PATCH`,
      [1024]: `DYNAMIC_SLOTS`,
      [2048]: `DEV_ROOT_FRAGMENT`,
      [-1]: `HOISTED`,
      [-2]: `BAIL`
    };
    var slotFlagsText = {
      [1]: "STABLE",
      [2]: "DYNAMIC",
      [3]: "FORWARDED"
    };
    var GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
    var isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
    var range = 2;
    function generateCodeFrame(source, start = 0, end = source.length) {
      let lines = source.split(/(\r?\n)/);
      const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
      lines = lines.filter((_, idx) => idx % 2 === 0);
      let count = 0;
      const res = [];
      for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
        if (count >= start) {
          for (let j = i - range; j <= i + range || end > count; j++) {
            if (j < 0 || j >= lines.length)
              continue;
            const line = j + 1;
            res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
            const lineLength = lines[j].length;
            const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
            if (j === i) {
              const pad = start - (count - (lineLength + newLineSeqLength));
              const length = Math.max(1, end > count ? lineLength - pad : end - start);
              res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
            } else if (j > i) {
              if (end > count) {
                const length = Math.max(Math.min(end - count, lineLength), 1);
                res.push(`   |  ` + "^".repeat(length));
              }
              count += lineLength + newLineSeqLength;
            }
          }
          break;
        }
      }
      return res.join("\n");
    }
    var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
    var isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
    function includeBooleanAttr(value) {
      return !!value || value === "";
    }
    var unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
    var attrValidationCache = {};
    function isSSRSafeAttrName(name) {
      if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
      }
      const isUnsafe = unsafeAttrCharRE.test(name);
      if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
      }
      return attrValidationCache[name] = !isUnsafe;
    }
    var propsToAttrMap = {
      acceptCharset: "accept-charset",
      className: "class",
      htmlFor: "for",
      httpEquiv: "http-equiv"
    };
    var isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
    var isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
    var isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
    function normalizeStyle(value) {
      if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
          if (normalized) {
            for (const key in normalized) {
              res[key] = normalized[key];
            }
          }
        }
        return res;
      } else if (isString(value)) {
        return value;
      } else if (isObject(value)) {
        return value;
      }
    }
    var listDelimiterRE = /;(?![^(]*\))/g;
    var propertyDelimiterRE = /:(.+)/;
    function parseStringStyle(cssText) {
      const ret = {};
      cssText.split(listDelimiterRE).forEach((item) => {
        if (item) {
          const tmp = item.split(propertyDelimiterRE);
          tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return ret;
    }
    function stringifyStyle(styles2) {
      let ret = "";
      if (!styles2 || isString(styles2)) {
        return ret;
      }
      for (const key in styles2) {
        const value = styles2[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
          ret += `${normalizedKey}:${value};`;
        }
      }
      return ret;
    }
    function normalizeClass(value) {
      let res = "";
      if (isString(value)) {
        res = value;
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i]);
          if (normalized) {
            res += normalized + " ";
          }
        }
      } else if (isObject(value)) {
        for (const name in value) {
          if (value[name]) {
            res += name + " ";
          }
        }
      }
      return res.trim();
    }
    function normalizeProps(props) {
      if (!props)
        return null;
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (style) {
        props.style = normalizeStyle(style);
      }
      return props;
    }
    var HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
    var SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
    var VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
    var isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
    var isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
    var isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
    var escapeRE = /["'&<>]/;
    function escapeHtml(string) {
      const str = "" + string;
      const match = escapeRE.exec(str);
      if (!match) {
        return str;
      }
      let html = "";
      let escaped;
      let index;
      let lastIndex = 0;
      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            escaped = "&quot;";
            break;
          case 38:
            escaped = "&amp;";
            break;
          case 39:
            escaped = "&#39;";
            break;
          case 60:
            escaped = "&lt;";
            break;
          case 62:
            escaped = "&gt;";
            break;
          default:
            continue;
        }
        if (lastIndex !== index) {
          html += str.slice(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
      }
      return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
    }
    var commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
    function escapeHtmlComment(src) {
      return src.replace(commentStripRE, "");
    }
    function looseCompareArrays(a, b) {
      if (a.length !== b.length)
        return false;
      let equal = true;
      for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
      }
      return equal;
    }
    function looseEqual(a, b) {
      if (a === b)
        return true;
      let aValidType = isDate(a);
      let bValidType = isDate(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
      }
      aValidType = isArray(a);
      bValidType = isArray(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
      }
      aValidType = isObject(a);
      bValidType = isObject(b);
      if (aValidType || bValidType) {
        if (!aValidType || !bValidType) {
          return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
          return false;
        }
        for (const key in a) {
          const aHasKey = a.hasOwnProperty(key);
          const bHasKey = b.hasOwnProperty(key);
          if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
            return false;
          }
        }
      }
      return String(a) === String(b);
    }
    function looseIndexOf(arr, val) {
      return arr.findIndex((item) => looseEqual(item, val));
    }
    var toDisplayString = (val) => {
      return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
    };
    var replacer = (_key, val) => {
      if (val && val.__v_isRef) {
        return replacer(_key, val.value);
      } else if (isMap(val)) {
        return {
          [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
            entries[`${key} =>`] = val2;
            return entries;
          }, {})
        };
      } else if (isSet(val)) {
        return {
          [`Set(${val.size})`]: [...val.values()]
        };
      } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
      }
      return val;
    };
    var EMPTY_OBJ = Object.freeze({});
    var EMPTY_ARR = Object.freeze([]);
    var NOOP = () => {
    };
    var NO = () => false;
    var onRE = /^on[^a-z]/;
    var isOn = (key) => onRE.test(key);
    var isModelListener = (key) => key.startsWith("onUpdate:");
    var extend = Object.assign;
    var remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasOwn = (val, key) => hasOwnProperty.call(val, key);
    var isArray = Array.isArray;
    var isMap = (val) => toTypeString(val) === "[object Map]";
    var isSet = (val) => toTypeString(val) === "[object Set]";
    var isDate = (val) => val instanceof Date;
    var isFunction = (val) => typeof val === "function";
    var isString = (val) => typeof val === "string";
    var isSymbol = (val) => typeof val === "symbol";
    var isObject = (val) => val !== null && typeof val === "object";
    var isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
    };
    var objectToString = Object.prototype.toString;
    var toTypeString = (value) => objectToString.call(value);
    var toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    var isPlainObject = (val) => toTypeString(val) === "[object Object]";
    var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
    var isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
    var cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    var camelizeRE = /-(\w)/g;
    var camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    });
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
    var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
    var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
    var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
    var invokeArrayFns = (fns, arg) => {
      for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
      }
    };
    var def = (obj, key, value) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
      });
    };
    var toNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
    };
    var _globalThis;
    var getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    exports.EMPTY_ARR = EMPTY_ARR;
    exports.EMPTY_OBJ = EMPTY_OBJ;
    exports.NO = NO;
    exports.NOOP = NOOP;
    exports.PatchFlagNames = PatchFlagNames;
    exports.camelize = camelize;
    exports.capitalize = capitalize;
    exports.def = def;
    exports.escapeHtml = escapeHtml;
    exports.escapeHtmlComment = escapeHtmlComment;
    exports.extend = extend;
    exports.generateCodeFrame = generateCodeFrame;
    exports.getGlobalThis = getGlobalThis;
    exports.hasChanged = hasChanged;
    exports.hasOwn = hasOwn;
    exports.hyphenate = hyphenate;
    exports.includeBooleanAttr = includeBooleanAttr;
    exports.invokeArrayFns = invokeArrayFns;
    exports.isArray = isArray;
    exports.isBooleanAttr = isBooleanAttr;
    exports.isBuiltInDirective = isBuiltInDirective;
    exports.isDate = isDate;
    exports.isFunction = isFunction;
    exports.isGloballyWhitelisted = isGloballyWhitelisted;
    exports.isHTMLTag = isHTMLTag;
    exports.isIntegerKey = isIntegerKey;
    exports.isKnownHtmlAttr = isKnownHtmlAttr;
    exports.isKnownSvgAttr = isKnownSvgAttr;
    exports.isMap = isMap;
    exports.isModelListener = isModelListener;
    exports.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
    exports.isObject = isObject;
    exports.isOn = isOn;
    exports.isPlainObject = isPlainObject;
    exports.isPromise = isPromise;
    exports.isReservedProp = isReservedProp;
    exports.isSSRSafeAttrName = isSSRSafeAttrName;
    exports.isSVGTag = isSVGTag;
    exports.isSet = isSet;
    exports.isSpecialBooleanAttr = isSpecialBooleanAttr;
    exports.isString = isString;
    exports.isSymbol = isSymbol;
    exports.isVoidTag = isVoidTag;
    exports.looseEqual = looseEqual;
    exports.looseIndexOf = looseIndexOf;
    exports.makeMap = makeMap;
    exports.normalizeClass = normalizeClass;
    exports.normalizeProps = normalizeProps;
    exports.normalizeStyle = normalizeStyle;
    exports.objectToString = objectToString;
    exports.parseStringStyle = parseStringStyle;
    exports.propsToAttrMap = propsToAttrMap;
    exports.remove = remove;
    exports.slotFlagsText = slotFlagsText;
    exports.stringifyStyle = stringifyStyle;
    exports.toDisplayString = toDisplayString;
    exports.toHandlerKey = toHandlerKey;
    exports.toNumber = toNumber;
    exports.toRawType = toRawType;
    exports.toTypeString = toTypeString;
  }
});

// ../../node_modules/@vue/shared/index.js
var require_shared = __commonJS({
  "../../node_modules/@vue/shared/index.js"(exports, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_shared_cjs_prod();
    } else {
      module2.exports = require_shared_cjs();
    }
  }
});

// ../../node_modules/@vue/reactivity/dist/reactivity.cjs.prod.js
var require_reactivity_cjs_prod = __commonJS({
  "../../node_modules/@vue/reactivity/dist/reactivity.cjs.prod.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var shared = require_shared();
    var activeEffectScope;
    var EffectScope = class {
      constructor(detached = false) {
        this.active = true;
        this.effects = [];
        this.cleanups = [];
        if (!detached && activeEffectScope) {
          this.parent = activeEffectScope;
          this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
        }
      }
      run(fn) {
        if (this.active) {
          try {
            activeEffectScope = this;
            return fn();
          } finally {
            activeEffectScope = this.parent;
          }
        }
      }
      on() {
        activeEffectScope = this;
      }
      off() {
        activeEffectScope = this.parent;
      }
      stop(fromParent) {
        if (this.active) {
          let i, l;
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].stop();
          }
          for (i = 0, l = this.cleanups.length; i < l; i++) {
            this.cleanups[i]();
          }
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].stop(true);
            }
          }
          if (this.parent && !fromParent) {
            const last = this.parent.scopes.pop();
            if (last && last !== this) {
              this.parent.scopes[this.index] = last;
              last.index = this.index;
            }
          }
          this.active = false;
        }
      }
    };
    function effectScope(detached) {
      return new EffectScope(detached);
    }
    function recordEffectScope(effect2, scope = activeEffectScope) {
      if (scope && scope.active) {
        scope.effects.push(effect2);
      }
    }
    function getCurrentScope() {
      return activeEffectScope;
    }
    function onScopeDispose(fn) {
      if (activeEffectScope) {
        activeEffectScope.cleanups.push(fn);
      }
    }
    var createDep = (effects) => {
      const dep = new Set(effects);
      dep.w = 0;
      dep.n = 0;
      return dep;
    };
    var wasTracked = (dep) => (dep.w & trackOpBit) > 0;
    var newTracked = (dep) => (dep.n & trackOpBit) > 0;
    var initDepMarkers = ({ deps }) => {
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].w |= trackOpBit;
        }
      }
    };
    var finalizeDepMarkers = (effect2) => {
      const { deps } = effect2;
      if (deps.length) {
        let ptr = 0;
        for (let i = 0; i < deps.length; i++) {
          const dep = deps[i];
          if (wasTracked(dep) && !newTracked(dep)) {
            dep.delete(effect2);
          } else {
            deps[ptr++] = dep;
          }
          dep.w &= ~trackOpBit;
          dep.n &= ~trackOpBit;
        }
        deps.length = ptr;
      }
    };
    var targetMap = /* @__PURE__ */ new WeakMap();
    var effectTrackDepth = 0;
    var trackOpBit = 1;
    var maxMarkerBits = 30;
    var activeEffect;
    var ITERATE_KEY = Symbol("");
    var MAP_KEY_ITERATE_KEY = Symbol("");
    var ReactiveEffect = class {
      constructor(fn, scheduler2 = null, scope) {
        this.fn = fn;
        this.scheduler = scheduler2;
        this.active = true;
        this.deps = [];
        this.parent = void 0;
        recordEffectScope(this, scope);
      }
      run() {
        if (!this.active) {
          return this.fn();
        }
        let parent = activeEffect;
        let lastShouldTrack = shouldTrack;
        while (parent) {
          if (parent === this) {
            return;
          }
          parent = parent.parent;
        }
        try {
          this.parent = activeEffect;
          activeEffect = this;
          shouldTrack = true;
          trackOpBit = 1 << ++effectTrackDepth;
          if (effectTrackDepth <= maxMarkerBits) {
            initDepMarkers(this);
          } else {
            cleanupEffect(this);
          }
          return this.fn();
        } finally {
          if (effectTrackDepth <= maxMarkerBits) {
            finalizeDepMarkers(this);
          }
          trackOpBit = 1 << --effectTrackDepth;
          activeEffect = this.parent;
          shouldTrack = lastShouldTrack;
          this.parent = void 0;
        }
      }
      stop() {
        if (this.active) {
          cleanupEffect(this);
          if (this.onStop) {
            this.onStop();
          }
          this.active = false;
        }
      }
    };
    function cleanupEffect(effect2) {
      const { deps } = effect2;
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].delete(effect2);
        }
        deps.length = 0;
      }
    }
    function effect(fn, options) {
      if (fn.effect) {
        fn = fn.effect.fn;
      }
      const _effect = new ReactiveEffect(fn);
      if (options) {
        shared.extend(_effect, options);
        if (options.scope)
          recordEffectScope(_effect, options.scope);
      }
      if (!options || !options.lazy) {
        _effect.run();
      }
      const runner = _effect.run.bind(_effect);
      runner.effect = _effect;
      return runner;
    }
    function stop(runner) {
      runner.effect.stop();
    }
    var shouldTrack = true;
    var trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function enableTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = true;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function track(target, type, key) {
      if (shouldTrack && activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
          targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
          depsMap.set(key, dep = createDep());
        }
        trackEffects(dep);
      }
    }
    function trackEffects(dep, debuggerEventExtraInfo) {
      let shouldTrack2 = false;
      if (effectTrackDepth <= maxMarkerBits) {
        if (!newTracked(dep)) {
          dep.n |= trackOpBit;
          shouldTrack2 = !wasTracked(dep);
        }
      } else {
        shouldTrack2 = !dep.has(activeEffect);
      }
      if (shouldTrack2) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        return;
      }
      let deps = [];
      if (type === "clear") {
        deps = [...depsMap.values()];
      } else if (key === "length" && shared.isArray(target)) {
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 >= newValue) {
            deps.push(dep);
          }
        });
      } else {
        if (key !== void 0) {
          deps.push(depsMap.get(key));
        }
        switch (type) {
          case "add":
            if (!shared.isArray(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (shared.isIntegerKey(key)) {
              deps.push(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!shared.isArray(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (shared.isMap(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
      if (deps.length === 1) {
        if (deps[0]) {
          {
            triggerEffects(deps[0]);
          }
        }
      } else {
        const effects = [];
        for (const dep of deps) {
          if (dep) {
            effects.push(...dep);
          }
        }
        {
          triggerEffects(createDep(effects));
        }
      }
    }
    function triggerEffects(dep, debuggerEventExtraInfo) {
      for (const effect2 of shared.isArray(dep) ? dep : [...dep]) {
        if (effect2 !== activeEffect || effect2.allowRecurse) {
          if (effect2.scheduler) {
            effect2.scheduler();
          } else {
            effect2.run();
          }
        }
      }
    }
    var isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
    var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(shared.isSymbol));
    var get = /* @__PURE__ */ createGetter();
    var shallowGet = /* @__PURE__ */ createGetter(false, true);
    var readonlyGet = /* @__PURE__ */ createGetter(true);
    var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
    var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
    function createArrayInstrumentations() {
      const instrumentations = {};
      ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
        instrumentations[key] = function(...args) {
          const arr = toRaw(this);
          for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get", i + "");
          }
          const res = arr[key](...args);
          if (res === -1 || res === false) {
            return arr[key](...args.map(toRaw));
          } else {
            return res;
          }
        };
      });
      ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
        instrumentations[key] = function(...args) {
          pauseTracking();
          const res = toRaw(this)[key].apply(this, args);
          resetTracking();
          return res;
        };
      });
      return instrumentations;
    }
    function createGetter(isReadonly2 = false, shallow = false) {
      return function get2(target, key, receiver) {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_isShallow") {
          return shallow;
        } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
          return target;
        }
        const targetIsArray = shared.isArray(target);
        if (!isReadonly2 && targetIsArray && shared.hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (shallow) {
          return res;
        }
        if (isRef(res)) {
          const shouldUnwrap = !targetIsArray || !shared.isIntegerKey(key);
          return shouldUnwrap ? res.value : res;
        }
        if (shared.isObject(res)) {
          return isReadonly2 ? readonly(res) : reactive3(res);
        }
        return res;
      };
    }
    var set = /* @__PURE__ */ createSetter();
    var shallowSet = /* @__PURE__ */ createSetter(true);
    function createSetter(shallow = false) {
      return function set2(target, key, value, receiver) {
        let oldValue = target[key];
        if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
          return false;
        }
        if (!shallow && !isReadonly(value)) {
          if (!isShallow(value)) {
            value = toRaw(value);
            oldValue = toRaw(oldValue);
          }
          if (!shared.isArray(target) && isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
          }
        }
        const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (shared.hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
        }
        return result;
      };
    }
    function deleteProperty(target, key) {
      const hadKey = shared.hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    function has(target, key) {
      const result = Reflect.has(target, key);
      if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    function ownKeys(target) {
      track(target, "iterate", shared.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    }
    var mutableHandlers = {
      get,
      set,
      deleteProperty,
      has,
      ownKeys
    };
    var readonlyHandlers = {
      get: readonlyGet,
      set(target, key) {
        return true;
      },
      deleteProperty(target, key) {
        return true;
      }
    };
    var shallowReactiveHandlers = /* @__PURE__ */ shared.extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
    });
    var shallowReadonlyHandlers = /* @__PURE__ */ shared.extend({}, readonlyHandlers, {
      get: shallowReadonlyGet
    });
    var toShallow = (value) => value;
    var getProto = (v) => Reflect.getPrototypeOf(v);
    function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
      target = target["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
        !isReadonly2 && track(rawTarget, "get", key);
      }
      !isReadonly2 && track(rawTarget, "get", rawKey);
      const { has: has2 } = getProto(rawTarget);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      if (has2.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has2.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    }
    function has$1(key, isReadonly2 = false) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
        !isReadonly2 && track(rawTarget, "has", key);
      }
      !isReadonly2 && track(rawTarget, "has", rawKey);
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    }
    function size(target, isReadonly2 = false) {
      target = target["__v_raw"];
      !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    }
    function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto2 = getProto(target);
      const hadKey = proto2.has.call(target, value);
      if (!hadKey) {
        target.add(value);
        trigger(target, "add", value, value);
      }
      return this;
    }
    function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const { has: has2, get: get2 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      }
      const oldValue = get2.call(target, key);
      target.set(key, value);
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (shared.hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
      return this;
    }
    function deleteEntry(key) {
      const target = toRaw(this);
      const { has: has2, get: get2 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      }
      get2 ? get2.call(target, key) : void 0;
      const result = target.delete(key);
      if (hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const result = target.clear();
      if (hadItems) {
        trigger(target, "clear", void 0, void 0);
      }
      return result;
    }
    function createForEach(isReadonly2, isShallow2) {
      return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      };
    }
    function createIterableMethod(method, isReadonly2, isShallow2) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const targetIsMap = shared.isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        return {
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          },
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        return type === "delete" ? false : this;
      };
    }
    function createInstrumentations() {
      const mutableInstrumentations2 = {
        get(key) {
          return get$1(this, key);
        },
        get size() {
          return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, false)
      };
      const shallowInstrumentations2 = {
        get(key) {
          return get$1(this, key, false, true);
        },
        get size() {
          return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, true)
      };
      const readonlyInstrumentations2 = {
        get(key) {
          return get$1(this, key, true);
        },
        get size() {
          return size(this, true);
        },
        has(key) {
          return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear"),
        forEach: createForEach(true, false)
      };
      const shallowReadonlyInstrumentations2 = {
        get(key) {
          return get$1(this, key, true, true);
        },
        get size() {
          return size(this, true);
        },
        has(key) {
          return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear"),
        forEach: createForEach(true, true)
      };
      const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
      iteratorMethods.forEach((method) => {
        mutableInstrumentations2[method] = createIterableMethod(method, false, false);
        readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
        shallowInstrumentations2[method] = createIterableMethod(method, false, true);
        shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
      });
      return [
        mutableInstrumentations2,
        readonlyInstrumentations2,
        shallowInstrumentations2,
        shallowReadonlyInstrumentations2
      ];
    }
    var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
    function createInstrumentationGetter(isReadonly2, shallow) {
      const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
      };
    }
    var mutableCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, false)
    };
    var shallowCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, true)
    };
    var readonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, false)
    };
    var shallowReadonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, true)
    };
    var reactiveMap = /* @__PURE__ */ new WeakMap();
    var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    var readonlyMap = /* @__PURE__ */ new WeakMap();
    var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
    }
    function reactive3(target) {
      if (isReadonly(target)) {
        return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
    }
    function shallowReactive(target) {
      return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
    }
    function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
    }
    function shallowReadonly(target) {
      return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
    }
    function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
      if (!shared.isObject(target)) {
        return target;
      }
      if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
    }
    function isReactive(value) {
      if (isReadonly(value)) {
        return isReactive(value["__v_raw"]);
      }
      return !!(value && value["__v_isReactive"]);
    }
    function isReadonly(value) {
      return !!(value && value["__v_isReadonly"]);
    }
    function isShallow(value) {
      return !!(value && value["__v_isShallow"]);
    }
    function isProxy(value) {
      return isReactive(value) || isReadonly(value);
    }
    function toRaw(observed) {
      const raw = observed && observed["__v_raw"];
      return raw ? toRaw(raw) : observed;
    }
    function markRaw(value) {
      shared.def(value, "__v_skip", true);
      return value;
    }
    var toReactive = (value) => shared.isObject(value) ? reactive3(value) : value;
    var toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
    function trackRefValue(ref2) {
      if (shouldTrack && activeEffect) {
        ref2 = toRaw(ref2);
        {
          trackEffects(ref2.dep || (ref2.dep = createDep()));
        }
      }
    }
    function triggerRefValue(ref2, newVal) {
      ref2 = toRaw(ref2);
      if (ref2.dep) {
        {
          triggerEffects(ref2.dep);
        }
      }
    }
    function isRef(r) {
      return !!(r && r.__v_isRef === true);
    }
    function ref(value) {
      return createRef(value, false);
    }
    function shallowRef(value) {
      return createRef(value, true);
    }
    function createRef(rawValue, shallow) {
      if (isRef(rawValue)) {
        return rawValue;
      }
      return new RefImpl(rawValue, shallow);
    }
    var RefImpl = class {
      constructor(value, __v_isShallow) {
        this.__v_isShallow = __v_isShallow;
        this.dep = void 0;
        this.__v_isRef = true;
        this._rawValue = __v_isShallow ? value : toRaw(value);
        this._value = __v_isShallow ? value : toReactive(value);
      }
      get value() {
        trackRefValue(this);
        return this._value;
      }
      set value(newVal) {
        newVal = this.__v_isShallow ? newVal : toRaw(newVal);
        if (shared.hasChanged(newVal, this._rawValue)) {
          this._rawValue = newVal;
          this._value = this.__v_isShallow ? newVal : toReactive(newVal);
          triggerRefValue(this);
        }
      }
    };
    function triggerRef(ref2) {
      triggerRefValue(ref2);
    }
    function unref(ref2) {
      return isRef(ref2) ? ref2.value : ref2;
    }
    var shallowUnwrapHandlers = {
      get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    function proxyRefs(objectWithRefs) {
      return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
    }
    var CustomRefImpl = class {
      constructor(factory) {
        this.dep = void 0;
        this.__v_isRef = true;
        const { get: get2, set: set2 } = factory(() => trackRefValue(this), () => triggerRefValue(this));
        this._get = get2;
        this._set = set2;
      }
      get value() {
        return this._get();
      }
      set value(newVal) {
        this._set(newVal);
      }
    };
    function customRef(factory) {
      return new CustomRefImpl(factory);
    }
    function toRefs(object) {
      const ret = shared.isArray(object) ? new Array(object.length) : {};
      for (const key in object) {
        ret[key] = toRef(object, key);
      }
      return ret;
    }
    var ObjectRefImpl = class {
      constructor(_object, _key, _defaultValue) {
        this._object = _object;
        this._key = _key;
        this._defaultValue = _defaultValue;
        this.__v_isRef = true;
      }
      get value() {
        const val = this._object[this._key];
        return val === void 0 ? this._defaultValue : val;
      }
      set value(newVal) {
        this._object[this._key] = newVal;
      }
    };
    function toRef(object, key, defaultValue) {
      const val = object[key];
      return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
    }
    var ComputedRefImpl = class {
      constructor(getter, _setter, isReadonly2, isSSR) {
        this._setter = _setter;
        this.dep = void 0;
        this.__v_isRef = true;
        this._dirty = true;
        this.effect = new ReactiveEffect(getter, () => {
          if (!this._dirty) {
            this._dirty = true;
            triggerRefValue(this);
          }
        });
        this.effect.computed = this;
        this.effect.active = this._cacheable = !isSSR;
        this["__v_isReadonly"] = isReadonly2;
      }
      get value() {
        const self2 = toRaw(this);
        trackRefValue(self2);
        if (self2._dirty || !self2._cacheable) {
          self2._dirty = false;
          self2._value = self2.effect.run();
        }
        return self2._value;
      }
      set value(newValue) {
        this._setter(newValue);
      }
    };
    function computed2(getterOrOptions, debugOptions, isSSR = false) {
      let getter;
      let setter;
      const onlyGetter = shared.isFunction(getterOrOptions);
      if (onlyGetter) {
        getter = getterOrOptions;
        setter = shared.NOOP;
      } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
      }
      const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
      return cRef;
    }
    var _a;
    var tick = Promise.resolve();
    var queue = [];
    var queued = false;
    var scheduler = (fn) => {
      queue.push(fn);
      if (!queued) {
        queued = true;
        tick.then(flush);
      }
    };
    var flush = () => {
      for (let i = 0; i < queue.length; i++) {
        queue[i]();
      }
      queue.length = 0;
      queued = false;
    };
    var DeferredComputedRefImpl = class {
      constructor(getter) {
        this.dep = void 0;
        this._dirty = true;
        this.__v_isRef = true;
        this[_a] = true;
        let compareTarget;
        let hasCompareTarget = false;
        let scheduled = false;
        this.effect = new ReactiveEffect(getter, (computedTrigger) => {
          if (this.dep) {
            if (computedTrigger) {
              compareTarget = this._value;
              hasCompareTarget = true;
            } else if (!scheduled) {
              const valueToCompare = hasCompareTarget ? compareTarget : this._value;
              scheduled = true;
              hasCompareTarget = false;
              scheduler(() => {
                if (this.effect.active && this._get() !== valueToCompare) {
                  triggerRefValue(this);
                }
                scheduled = false;
              });
            }
            for (const e of this.dep) {
              if (e.computed instanceof DeferredComputedRefImpl) {
                e.scheduler(true);
              }
            }
          }
          this._dirty = true;
        });
        this.effect.computed = this;
      }
      _get() {
        if (this._dirty) {
          this._dirty = false;
          return this._value = this.effect.run();
        }
        return this._value;
      }
      get value() {
        trackRefValue(this);
        return toRaw(this)._get();
      }
    };
    _a = "__v_isReadonly";
    function deferredComputed(getter) {
      return new DeferredComputedRefImpl(getter);
    }
    exports.EffectScope = EffectScope;
    exports.ITERATE_KEY = ITERATE_KEY;
    exports.ReactiveEffect = ReactiveEffect;
    exports.computed = computed2;
    exports.customRef = customRef;
    exports.deferredComputed = deferredComputed;
    exports.effect = effect;
    exports.effectScope = effectScope;
    exports.enableTracking = enableTracking;
    exports.getCurrentScope = getCurrentScope;
    exports.isProxy = isProxy;
    exports.isReactive = isReactive;
    exports.isReadonly = isReadonly;
    exports.isRef = isRef;
    exports.isShallow = isShallow;
    exports.markRaw = markRaw;
    exports.onScopeDispose = onScopeDispose;
    exports.pauseTracking = pauseTracking;
    exports.proxyRefs = proxyRefs;
    exports.reactive = reactive3;
    exports.readonly = readonly;
    exports.ref = ref;
    exports.resetTracking = resetTracking;
    exports.shallowReactive = shallowReactive;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowRef = shallowRef;
    exports.stop = stop;
    exports.toRaw = toRaw;
    exports.toRef = toRef;
    exports.toRefs = toRefs;
    exports.track = track;
    exports.trigger = trigger;
    exports.triggerRef = triggerRef;
    exports.unref = unref;
  }
});

// ../../node_modules/@vue/reactivity/dist/reactivity.cjs.js
var require_reactivity_cjs = __commonJS({
  "../../node_modules/@vue/reactivity/dist/reactivity.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var shared = require_shared();
    function warn(msg, ...args) {
      console.warn(`[Vue warn] ${msg}`, ...args);
    }
    var activeEffectScope;
    var EffectScope = class {
      constructor(detached = false) {
        this.active = true;
        this.effects = [];
        this.cleanups = [];
        if (!detached && activeEffectScope) {
          this.parent = activeEffectScope;
          this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
        }
      }
      run(fn) {
        if (this.active) {
          try {
            activeEffectScope = this;
            return fn();
          } finally {
            activeEffectScope = this.parent;
          }
        } else {
          warn(`cannot run an inactive effect scope.`);
        }
      }
      on() {
        activeEffectScope = this;
      }
      off() {
        activeEffectScope = this.parent;
      }
      stop(fromParent) {
        if (this.active) {
          let i, l;
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].stop();
          }
          for (i = 0, l = this.cleanups.length; i < l; i++) {
            this.cleanups[i]();
          }
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].stop(true);
            }
          }
          if (this.parent && !fromParent) {
            const last = this.parent.scopes.pop();
            if (last && last !== this) {
              this.parent.scopes[this.index] = last;
              last.index = this.index;
            }
          }
          this.active = false;
        }
      }
    };
    function effectScope(detached) {
      return new EffectScope(detached);
    }
    function recordEffectScope(effect2, scope = activeEffectScope) {
      if (scope && scope.active) {
        scope.effects.push(effect2);
      }
    }
    function getCurrentScope() {
      return activeEffectScope;
    }
    function onScopeDispose(fn) {
      if (activeEffectScope) {
        activeEffectScope.cleanups.push(fn);
      } else {
        warn(`onScopeDispose() is called when there is no active effect scope to be associated with.`);
      }
    }
    var createDep = (effects) => {
      const dep = new Set(effects);
      dep.w = 0;
      dep.n = 0;
      return dep;
    };
    var wasTracked = (dep) => (dep.w & trackOpBit) > 0;
    var newTracked = (dep) => (dep.n & trackOpBit) > 0;
    var initDepMarkers = ({ deps }) => {
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].w |= trackOpBit;
        }
      }
    };
    var finalizeDepMarkers = (effect2) => {
      const { deps } = effect2;
      if (deps.length) {
        let ptr = 0;
        for (let i = 0; i < deps.length; i++) {
          const dep = deps[i];
          if (wasTracked(dep) && !newTracked(dep)) {
            dep.delete(effect2);
          } else {
            deps[ptr++] = dep;
          }
          dep.w &= ~trackOpBit;
          dep.n &= ~trackOpBit;
        }
        deps.length = ptr;
      }
    };
    var targetMap = /* @__PURE__ */ new WeakMap();
    var effectTrackDepth = 0;
    var trackOpBit = 1;
    var maxMarkerBits = 30;
    var activeEffect;
    var ITERATE_KEY = Symbol("iterate");
    var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
    var ReactiveEffect = class {
      constructor(fn, scheduler2 = null, scope) {
        this.fn = fn;
        this.scheduler = scheduler2;
        this.active = true;
        this.deps = [];
        this.parent = void 0;
        recordEffectScope(this, scope);
      }
      run() {
        if (!this.active) {
          return this.fn();
        }
        let parent = activeEffect;
        let lastShouldTrack = shouldTrack;
        while (parent) {
          if (parent === this) {
            return;
          }
          parent = parent.parent;
        }
        try {
          this.parent = activeEffect;
          activeEffect = this;
          shouldTrack = true;
          trackOpBit = 1 << ++effectTrackDepth;
          if (effectTrackDepth <= maxMarkerBits) {
            initDepMarkers(this);
          } else {
            cleanupEffect(this);
          }
          return this.fn();
        } finally {
          if (effectTrackDepth <= maxMarkerBits) {
            finalizeDepMarkers(this);
          }
          trackOpBit = 1 << --effectTrackDepth;
          activeEffect = this.parent;
          shouldTrack = lastShouldTrack;
          this.parent = void 0;
        }
      }
      stop() {
        if (this.active) {
          cleanupEffect(this);
          if (this.onStop) {
            this.onStop();
          }
          this.active = false;
        }
      }
    };
    function cleanupEffect(effect2) {
      const { deps } = effect2;
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].delete(effect2);
        }
        deps.length = 0;
      }
    }
    function effect(fn, options) {
      if (fn.effect) {
        fn = fn.effect.fn;
      }
      const _effect = new ReactiveEffect(fn);
      if (options) {
        shared.extend(_effect, options);
        if (options.scope)
          recordEffectScope(_effect, options.scope);
      }
      if (!options || !options.lazy) {
        _effect.run();
      }
      const runner = _effect.run.bind(_effect);
      runner.effect = _effect;
      return runner;
    }
    function stop(runner) {
      runner.effect.stop();
    }
    var shouldTrack = true;
    var trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function enableTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = true;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function track(target, type, key) {
      if (shouldTrack && activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
          targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
          depsMap.set(key, dep = createDep());
        }
        const eventInfo = { effect: activeEffect, target, type, key };
        trackEffects(dep, eventInfo);
      }
    }
    function trackEffects(dep, debuggerEventExtraInfo) {
      let shouldTrack2 = false;
      if (effectTrackDepth <= maxMarkerBits) {
        if (!newTracked(dep)) {
          dep.n |= trackOpBit;
          shouldTrack2 = !wasTracked(dep);
        }
      } else {
        shouldTrack2 = !dep.has(activeEffect);
      }
      if (shouldTrack2) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (activeEffect.onTrack) {
          activeEffect.onTrack(Object.assign({
            effect: activeEffect
          }, debuggerEventExtraInfo));
        }
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        return;
      }
      let deps = [];
      if (type === "clear") {
        deps = [...depsMap.values()];
      } else if (key === "length" && shared.isArray(target)) {
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 >= newValue) {
            deps.push(dep);
          }
        });
      } else {
        if (key !== void 0) {
          deps.push(depsMap.get(key));
        }
        switch (type) {
          case "add":
            if (!shared.isArray(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (shared.isIntegerKey(key)) {
              deps.push(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!shared.isArray(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (shared.isMap(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
      const eventInfo = { target, type, key, newValue, oldValue, oldTarget };
      if (deps.length === 1) {
        if (deps[0]) {
          {
            triggerEffects(deps[0], eventInfo);
          }
        }
      } else {
        const effects = [];
        for (const dep of deps) {
          if (dep) {
            effects.push(...dep);
          }
        }
        {
          triggerEffects(createDep(effects), eventInfo);
        }
      }
    }
    function triggerEffects(dep, debuggerEventExtraInfo) {
      for (const effect2 of shared.isArray(dep) ? dep : [...dep]) {
        if (effect2 !== activeEffect || effect2.allowRecurse) {
          if (effect2.onTrigger) {
            effect2.onTrigger(shared.extend({ effect: effect2 }, debuggerEventExtraInfo));
          }
          if (effect2.scheduler) {
            effect2.scheduler();
          } else {
            effect2.run();
          }
        }
      }
    }
    var isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
    var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(shared.isSymbol));
    var get = /* @__PURE__ */ createGetter();
    var shallowGet = /* @__PURE__ */ createGetter(false, true);
    var readonlyGet = /* @__PURE__ */ createGetter(true);
    var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
    var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
    function createArrayInstrumentations() {
      const instrumentations = {};
      ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
        instrumentations[key] = function(...args) {
          const arr = toRaw(this);
          for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get", i + "");
          }
          const res = arr[key](...args);
          if (res === -1 || res === false) {
            return arr[key](...args.map(toRaw));
          } else {
            return res;
          }
        };
      });
      ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
        instrumentations[key] = function(...args) {
          pauseTracking();
          const res = toRaw(this)[key].apply(this, args);
          resetTracking();
          return res;
        };
      });
      return instrumentations;
    }
    function createGetter(isReadonly2 = false, shallow = false) {
      return function get2(target, key, receiver) {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_isShallow") {
          return shallow;
        } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
          return target;
        }
        const targetIsArray = shared.isArray(target);
        if (!isReadonly2 && targetIsArray && shared.hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (shallow) {
          return res;
        }
        if (isRef(res)) {
          const shouldUnwrap = !targetIsArray || !shared.isIntegerKey(key);
          return shouldUnwrap ? res.value : res;
        }
        if (shared.isObject(res)) {
          return isReadonly2 ? readonly(res) : reactive3(res);
        }
        return res;
      };
    }
    var set = /* @__PURE__ */ createSetter();
    var shallowSet = /* @__PURE__ */ createSetter(true);
    function createSetter(shallow = false) {
      return function set2(target, key, value, receiver) {
        let oldValue = target[key];
        if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
          return false;
        }
        if (!shallow && !isReadonly(value)) {
          if (!isShallow(value)) {
            value = toRaw(value);
            oldValue = toRaw(oldValue);
          }
          if (!shared.isArray(target) && isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
          }
        }
        const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (shared.hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
        }
        return result;
      };
    }
    function deleteProperty(target, key) {
      const hadKey = shared.hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    function has(target, key) {
      const result = Reflect.has(target, key);
      if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    function ownKeys(target) {
      track(target, "iterate", shared.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    }
    var mutableHandlers = {
      get,
      set,
      deleteProperty,
      has,
      ownKeys
    };
    var readonlyHandlers = {
      get: readonlyGet,
      set(target, key) {
        {
          console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
      },
      deleteProperty(target, key) {
        {
          console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
      }
    };
    var shallowReactiveHandlers = /* @__PURE__ */ shared.extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
    });
    var shallowReadonlyHandlers = /* @__PURE__ */ shared.extend({}, readonlyHandlers, {
      get: shallowReadonlyGet
    });
    var toShallow = (value) => value;
    var getProto = (v) => Reflect.getPrototypeOf(v);
    function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
      target = target["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
        !isReadonly2 && track(rawTarget, "get", key);
      }
      !isReadonly2 && track(rawTarget, "get", rawKey);
      const { has: has2 } = getProto(rawTarget);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      if (has2.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has2.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    }
    function has$1(key, isReadonly2 = false) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
        !isReadonly2 && track(rawTarget, "has", key);
      }
      !isReadonly2 && track(rawTarget, "has", rawKey);
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    }
    function size(target, isReadonly2 = false) {
      target = target["__v_raw"];
      !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    }
    function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto2 = getProto(target);
      const hadKey = proto2.has.call(target, value);
      if (!hadKey) {
        target.add(value);
        trigger(target, "add", value, value);
      }
      return this;
    }
    function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const { has: has2, get: get2 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      } else {
        checkIdentityKeys(target, has2, key);
      }
      const oldValue = get2.call(target, key);
      target.set(key, value);
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (shared.hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
      return this;
    }
    function deleteEntry(key) {
      const target = toRaw(this);
      const { has: has2, get: get2 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      } else {
        checkIdentityKeys(target, has2, key);
      }
      const oldValue = get2 ? get2.call(target, key) : void 0;
      const result = target.delete(key);
      if (hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const oldTarget = shared.isMap(target) ? new Map(target) : new Set(target);
      const result = target.clear();
      if (hadItems) {
        trigger(target, "clear", void 0, void 0, oldTarget);
      }
      return result;
    }
    function createForEach(isReadonly2, isShallow2) {
      return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      };
    }
    function createIterableMethod(method, isReadonly2, isShallow2) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const targetIsMap = shared.isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        return {
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          },
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        {
          const key = args[0] ? `on key "${args[0]}" ` : ``;
          console.warn(`${shared.capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
        }
        return type === "delete" ? false : this;
      };
    }
    function createInstrumentations() {
      const mutableInstrumentations2 = {
        get(key) {
          return get$1(this, key);
        },
        get size() {
          return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, false)
      };
      const shallowInstrumentations2 = {
        get(key) {
          return get$1(this, key, false, true);
        },
        get size() {
          return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, true)
      };
      const readonlyInstrumentations2 = {
        get(key) {
          return get$1(this, key, true);
        },
        get size() {
          return size(this, true);
        },
        has(key) {
          return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear"),
        forEach: createForEach(true, false)
      };
      const shallowReadonlyInstrumentations2 = {
        get(key) {
          return get$1(this, key, true, true);
        },
        get size() {
          return size(this, true);
        },
        has(key) {
          return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear"),
        forEach: createForEach(true, true)
      };
      const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
      iteratorMethods.forEach((method) => {
        mutableInstrumentations2[method] = createIterableMethod(method, false, false);
        readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
        shallowInstrumentations2[method] = createIterableMethod(method, false, true);
        shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
      });
      return [
        mutableInstrumentations2,
        readonlyInstrumentations2,
        shallowInstrumentations2,
        shallowReadonlyInstrumentations2
      ];
    }
    var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
    function createInstrumentationGetter(isReadonly2, shallow) {
      const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
      };
    }
    var mutableCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, false)
    };
    var shallowCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, true)
    };
    var readonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, false)
    };
    var shallowReadonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, true)
    };
    function checkIdentityKeys(target, has2, key) {
      const rawKey = toRaw(key);
      if (rawKey !== key && has2.call(target, rawKey)) {
        const type = shared.toRawType(target);
        console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
      }
    }
    var reactiveMap = /* @__PURE__ */ new WeakMap();
    var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    var readonlyMap = /* @__PURE__ */ new WeakMap();
    var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
    }
    function reactive3(target) {
      if (isReadonly(target)) {
        return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
    }
    function shallowReactive(target) {
      return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
    }
    function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
    }
    function shallowReadonly(target) {
      return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
    }
    function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
      if (!shared.isObject(target)) {
        {
          console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
      }
      if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
    }
    function isReactive(value) {
      if (isReadonly(value)) {
        return isReactive(value["__v_raw"]);
      }
      return !!(value && value["__v_isReactive"]);
    }
    function isReadonly(value) {
      return !!(value && value["__v_isReadonly"]);
    }
    function isShallow(value) {
      return !!(value && value["__v_isShallow"]);
    }
    function isProxy(value) {
      return isReactive(value) || isReadonly(value);
    }
    function toRaw(observed) {
      const raw = observed && observed["__v_raw"];
      return raw ? toRaw(raw) : observed;
    }
    function markRaw(value) {
      shared.def(value, "__v_skip", true);
      return value;
    }
    var toReactive = (value) => shared.isObject(value) ? reactive3(value) : value;
    var toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
    function trackRefValue(ref2) {
      if (shouldTrack && activeEffect) {
        ref2 = toRaw(ref2);
        {
          trackEffects(ref2.dep || (ref2.dep = createDep()), {
            target: ref2,
            type: "get",
            key: "value"
          });
        }
      }
    }
    function triggerRefValue(ref2, newVal) {
      ref2 = toRaw(ref2);
      if (ref2.dep) {
        {
          triggerEffects(ref2.dep, {
            target: ref2,
            type: "set",
            key: "value",
            newValue: newVal
          });
        }
      }
    }
    function isRef(r) {
      return !!(r && r.__v_isRef === true);
    }
    function ref(value) {
      return createRef(value, false);
    }
    function shallowRef(value) {
      return createRef(value, true);
    }
    function createRef(rawValue, shallow) {
      if (isRef(rawValue)) {
        return rawValue;
      }
      return new RefImpl(rawValue, shallow);
    }
    var RefImpl = class {
      constructor(value, __v_isShallow) {
        this.__v_isShallow = __v_isShallow;
        this.dep = void 0;
        this.__v_isRef = true;
        this._rawValue = __v_isShallow ? value : toRaw(value);
        this._value = __v_isShallow ? value : toReactive(value);
      }
      get value() {
        trackRefValue(this);
        return this._value;
      }
      set value(newVal) {
        newVal = this.__v_isShallow ? newVal : toRaw(newVal);
        if (shared.hasChanged(newVal, this._rawValue)) {
          this._rawValue = newVal;
          this._value = this.__v_isShallow ? newVal : toReactive(newVal);
          triggerRefValue(this, newVal);
        }
      }
    };
    function triggerRef(ref2) {
      triggerRefValue(ref2, ref2.value);
    }
    function unref(ref2) {
      return isRef(ref2) ? ref2.value : ref2;
    }
    var shallowUnwrapHandlers = {
      get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    function proxyRefs(objectWithRefs) {
      return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
    }
    var CustomRefImpl = class {
      constructor(factory) {
        this.dep = void 0;
        this.__v_isRef = true;
        const { get: get2, set: set2 } = factory(() => trackRefValue(this), () => triggerRefValue(this));
        this._get = get2;
        this._set = set2;
      }
      get value() {
        return this._get();
      }
      set value(newVal) {
        this._set(newVal);
      }
    };
    function customRef(factory) {
      return new CustomRefImpl(factory);
    }
    function toRefs(object) {
      if (!isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
      }
      const ret = shared.isArray(object) ? new Array(object.length) : {};
      for (const key in object) {
        ret[key] = toRef(object, key);
      }
      return ret;
    }
    var ObjectRefImpl = class {
      constructor(_object, _key, _defaultValue) {
        this._object = _object;
        this._key = _key;
        this._defaultValue = _defaultValue;
        this.__v_isRef = true;
      }
      get value() {
        const val = this._object[this._key];
        return val === void 0 ? this._defaultValue : val;
      }
      set value(newVal) {
        this._object[this._key] = newVal;
      }
    };
    function toRef(object, key, defaultValue) {
      const val = object[key];
      return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
    }
    var ComputedRefImpl = class {
      constructor(getter, _setter, isReadonly2, isSSR) {
        this._setter = _setter;
        this.dep = void 0;
        this.__v_isRef = true;
        this._dirty = true;
        this.effect = new ReactiveEffect(getter, () => {
          if (!this._dirty) {
            this._dirty = true;
            triggerRefValue(this);
          }
        });
        this.effect.computed = this;
        this.effect.active = this._cacheable = !isSSR;
        this["__v_isReadonly"] = isReadonly2;
      }
      get value() {
        const self2 = toRaw(this);
        trackRefValue(self2);
        if (self2._dirty || !self2._cacheable) {
          self2._dirty = false;
          self2._value = self2.effect.run();
        }
        return self2._value;
      }
      set value(newValue) {
        this._setter(newValue);
      }
    };
    function computed2(getterOrOptions, debugOptions, isSSR = false) {
      let getter;
      let setter;
      const onlyGetter = shared.isFunction(getterOrOptions);
      if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => {
          console.warn("Write operation failed: computed value is readonly");
        };
      } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
      }
      const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
      if (debugOptions && !isSSR) {
        cRef.effect.onTrack = debugOptions.onTrack;
        cRef.effect.onTrigger = debugOptions.onTrigger;
      }
      return cRef;
    }
    var _a;
    var tick = Promise.resolve();
    var queue = [];
    var queued = false;
    var scheduler = (fn) => {
      queue.push(fn);
      if (!queued) {
        queued = true;
        tick.then(flush);
      }
    };
    var flush = () => {
      for (let i = 0; i < queue.length; i++) {
        queue[i]();
      }
      queue.length = 0;
      queued = false;
    };
    var DeferredComputedRefImpl = class {
      constructor(getter) {
        this.dep = void 0;
        this._dirty = true;
        this.__v_isRef = true;
        this[_a] = true;
        let compareTarget;
        let hasCompareTarget = false;
        let scheduled = false;
        this.effect = new ReactiveEffect(getter, (computedTrigger) => {
          if (this.dep) {
            if (computedTrigger) {
              compareTarget = this._value;
              hasCompareTarget = true;
            } else if (!scheduled) {
              const valueToCompare = hasCompareTarget ? compareTarget : this._value;
              scheduled = true;
              hasCompareTarget = false;
              scheduler(() => {
                if (this.effect.active && this._get() !== valueToCompare) {
                  triggerRefValue(this);
                }
                scheduled = false;
              });
            }
            for (const e of this.dep) {
              if (e.computed instanceof DeferredComputedRefImpl) {
                e.scheduler(true);
              }
            }
          }
          this._dirty = true;
        });
        this.effect.computed = this;
      }
      _get() {
        if (this._dirty) {
          this._dirty = false;
          return this._value = this.effect.run();
        }
        return this._value;
      }
      get value() {
        trackRefValue(this);
        return toRaw(this)._get();
      }
    };
    _a = "__v_isReadonly";
    function deferredComputed(getter) {
      return new DeferredComputedRefImpl(getter);
    }
    exports.EffectScope = EffectScope;
    exports.ITERATE_KEY = ITERATE_KEY;
    exports.ReactiveEffect = ReactiveEffect;
    exports.computed = computed2;
    exports.customRef = customRef;
    exports.deferredComputed = deferredComputed;
    exports.effect = effect;
    exports.effectScope = effectScope;
    exports.enableTracking = enableTracking;
    exports.getCurrentScope = getCurrentScope;
    exports.isProxy = isProxy;
    exports.isReactive = isReactive;
    exports.isReadonly = isReadonly;
    exports.isRef = isRef;
    exports.isShallow = isShallow;
    exports.markRaw = markRaw;
    exports.onScopeDispose = onScopeDispose;
    exports.pauseTracking = pauseTracking;
    exports.proxyRefs = proxyRefs;
    exports.reactive = reactive3;
    exports.readonly = readonly;
    exports.ref = ref;
    exports.resetTracking = resetTracking;
    exports.shallowReactive = shallowReactive;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowRef = shallowRef;
    exports.stop = stop;
    exports.toRaw = toRaw;
    exports.toRef = toRef;
    exports.toRefs = toRefs;
    exports.track = track;
    exports.trigger = trigger;
    exports.triggerRef = triggerRef;
    exports.unref = unref;
  }
});

// ../../node_modules/@vue/reactivity/index.js
var require_reactivity = __commonJS({
  "../../node_modules/@vue/reactivity/index.js"(exports, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_reactivity_cjs_prod();
    } else {
      module2.exports = require_reactivity_cjs();
    }
  }
});

// ../../node_modules/@vue-reactivity/watch/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/@vue-reactivity/watch/dist/index.js"(exports, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, copyDefault, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames2(module22))
          if (!__hasOwnProp2.call(target, key) && (copyDefault || key !== "default"))
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc2(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toCommonJS = /* @__PURE__ */ ((cache) => {
      return (module22, temp) => {
        return cache && cache.get(module22) || (temp = __reExport(__markAsModule({}), module22, 1), cache && cache.set(module22, temp), temp);
      };
    })(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
    var src_exports = {};
    __export(src_exports, {
      watch: () => watch2,
      watchEffect: () => watchEffect
    });
    var import_reactivity3 = require_reactivity();
    var import_shared2 = require_shared();
    var import_shared = require_shared();
    function callWithErrorHandling(fn, type, args) {
      let res;
      try {
        res = args ? fn(...args) : fn();
      } catch (err) {
        handleError(err, type);
      }
      return res;
    }
    function callWithAsyncErrorHandling(fn, type, args) {
      if ((0, import_shared.isFunction)(fn)) {
        const res = callWithErrorHandling(fn, type, args);
        if (res && (0, import_shared.isPromise)(res)) {
          res.catch((err) => {
            handleError(err, type);
          });
        }
        return res;
      }
      const values = [];
      for (let i = 0; i < fn.length; i++)
        values.push(callWithAsyncErrorHandling(fn[i], type, args));
      return values;
    }
    function handleError(err, type) {
      console.error(new Error(`[@vue-reactivity/watch]: ${type}`));
      console.error(err);
    }
    function warn(message) {
      console.warn(createError(message));
    }
    function createError(message) {
      return new Error(`[reactivue]: ${message}`);
    }
    var INITIAL_WATCHER_VALUE = {};
    function watchEffect(effect, options) {
      return doWatch(effect, null, options);
    }
    function watch2(source, cb, options) {
      return doWatch(source, cb, options);
    }
    function doWatch(source, cb, { immediate, deep, flush } = {}) {
      let getter;
      let forceTrigger = false;
      let isMultiSource = false;
      if ((0, import_reactivity3.isRef)(source)) {
        getter = () => source.value;
        forceTrigger = (0, import_reactivity3.isShallow)(source);
      } else if ((0, import_reactivity3.isReactive)(source)) {
        getter = () => source;
        deep = true;
      } else if ((0, import_shared2.isArray)(source)) {
        isMultiSource = true;
        forceTrigger = source.some(import_reactivity3.isReactive);
        getter = () => source.map((s) => {
          if ((0, import_reactivity3.isRef)(s))
            return s.value;
          else if ((0, import_reactivity3.isReactive)(s))
            return traverse(s);
          else if ((0, import_shared2.isFunction)(s))
            return callWithErrorHandling(s, "watch getter");
          else
            return warn("invalid source");
        });
      } else if ((0, import_shared2.isFunction)(source)) {
        if (cb) {
          getter = () => callWithErrorHandling(source, "watch getter");
        } else {
          getter = () => {
            if (cleanup)
              cleanup();
            return callWithAsyncErrorHandling(source, "watch callback", [onCleanup]);
          };
        }
      } else {
        getter = import_shared2.NOOP;
      }
      if (cb && deep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
      }
      let cleanup;
      let onCleanup = (fn) => {
        cleanup = effect.onStop = () => {
          callWithErrorHandling(fn, "watch cleanup");
        };
      };
      let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
      const job = () => {
        if (!effect.active)
          return;
        if (cb) {
          const newValue = effect.run();
          if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => (0, import_shared2.hasChanged)(v, oldValue[i])) : (0, import_shared2.hasChanged)(newValue, oldValue))) {
            if (cleanup)
              cleanup();
            callWithAsyncErrorHandling(cb, "watch value", [
              newValue,
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
              onCleanup
            ]);
            oldValue = newValue;
          }
        } else {
          effect.run();
        }
      };
      job.allowRecurse = !!cb;
      let scheduler;
      if (flush === "sync") {
        scheduler = job;
      } else {
        scheduler = () => {
          job();
        };
      }
      const effect = new import_reactivity3.ReactiveEffect(getter, scheduler);
      if (cb) {
        if (immediate)
          job();
        else
          oldValue = effect.run();
      } else {
        effect.run();
      }
      return () => effect.stop();
    }
    function traverse(value, seen = /* @__PURE__ */ new Set()) {
      if (!(0, import_shared2.isObject)(value) || seen.has(value))
        return value;
      seen.add(value);
      if ((0, import_shared2.isArray)(value)) {
        for (let i = 0; i < value.length; i++)
          traverse(value[i], seen);
      } else if (value instanceof Map) {
        value.forEach((_, key) => {
          traverse(value.get(key), seen);
        });
      } else if (value instanceof Set) {
        value.forEach((v) => {
          traverse(v, seen);
        });
      } else {
        for (const key of Object.keys(value))
          traverse(value[key], seen);
      }
      return value;
    }
    module2.exports = __toCommonJS(src_exports);
  }
});

// src/server/index.ts
var import_reflect_metadata = require("reflect-metadata");
var import_tsyringe21 = require("tsyringe");
var import_http = __toESM(require("http"));

// src/shared/constants.ts
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

// ../../node_modules/chalk/source/vendor/ansi-styles/index.js
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

// ../../node_modules/chalk/source/vendor/supports-color/index.js
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

// ../../node_modules/chalk/source/utilities.js
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

// ../../node_modules/chalk/source/index.js
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
var createBuilder = (self2, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self2;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self2, string) => {
  if (self2.level <= 0 || !string) {
    return self2[IS_EMPTY] ? "" : string;
  }
  let styler = self2[STYLER];
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

// src/server/errors.ts
var import_http_errors = require("http-errors");
var PostOrPageNotFoundError = class extends import_http_errors.NotFound {
  constructor(type, msg) {
    super(msg != null ? msg : `${type} not found`);
    this.id = "PostOrPageNotFoundError";
  }
};
var HexoInitError = class extends import_http_errors.InternalServerError {
  constructor() {
    super(...arguments);
    this.id = "HexoInitError";
  }
};
var InvalidOptionsError = class extends import_http_errors.BadRequest {
  constructor(message, id = "InvalidOptionsError") {
    super(message);
    this.id = id;
  }
};
var ScriptError = class extends import_http_errors.InternalServerError {
  constructor(message, id = "ScriptError") {
    super(message);
    this.id = id;
  }
};

// src/server/services/hexo-instance-service.ts
var HexoInstanceService = class {
  constructor(_logService, _storageService) {
    this._logService = _logService;
    this._storageService = _storageService;
    this._options = null;
    this._base = null;
    this._hexo = null;
    this._ready = false;
    this._promise = null;
    this._logService.setScope("hexo-instance-service");
  }
  _withOptionsOverrides(options) {
    return __spreadProps(__spreadValues({}, options), { draft: true, drafts: true });
  }
  _setHexoBase() {
    const base = this._storageService.get(HexoInstanceService.HEXO_BASE_DIR_KEY);
    const base_dir = import_path4.default.resolve(__dirname, toRealPath(base));
    if (!isBlog(base_dir))
      throw new Error(`"${base_dir}" is not a hexo blog folder`);
    this._base = base_dir;
  }
  _setOptions() {
    this._options = this._storageService.get(HexoInstanceService.HEXO_OPTIONS_KEY) || {};
    this._options.silent = DEV ? false : this._options.silent;
  }
  _createHexoInstance() {
    if (!this._base)
      throw new Error("please set hexo root first");
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
    this._storageService.set(HexoInstanceService.HEXO_OPTIONS_KEY, options);
    this._logService.log("options set");
  }
  async _tryInit(count = HexoInstanceService.MAX_RETRY) {
    try {
      await this._init();
      HexoInstanceService.INITING = false;
    } catch (err) {
      this._logService.error(err);
      this._logService.error(`error when init hexo instance. `);
      this._logService.error(`retry in ${HexoInstanceService.RETRY_INTERVAL} ms.`, `${count} retry left`);
      if (count)
        return new Promise((resolve4) => {
          setTimeout(() => {
            resolve4(this._tryInit(count - 1));
          }, HexoInstanceService.RETRY_INTERVAL);
        });
      else {
        HexoInstanceService.INITING = false;
        throw new HexoInitError(String(err));
      }
    }
  }
  async init() {
    if (!HexoInstanceService.INITING)
      this._promise = this._tryInit();
    return this._promise;
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
    if (!this._ready)
      await this.init();
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
    if (!this._ready)
      await this.init();
    const unload = async () => {
      await this._hexo.unwatch();
    };
    const load = async () => {
      await this._hexo.watch();
      HexoInstanceService.INITING = false;
    };
    const markHexoInitError = (err) => {
      this._ready = false;
      HexoInstanceService.INITING = false;
    };
    HexoInstanceService.INITING = true;
    await unload().catch(markHexoInitError);
    const res = await Promise.resolve(fn());
    await load().catch(markHexoInitError);
    return res;
  }
};
HexoInstanceService.HEXO_BASE_DIR_KEY = "hexo-basedir";
HexoInstanceService.HEXO_OPTIONS_KEY = "hexo-options";
HexoInstanceService.INITING = false;
HexoInstanceService.PENDING_COUNT = 0;
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
var import_tsyringe20 = require("tsyringe");
var import_koa = __toESM(require("koa"));
var import_koa_bodyparser = __toESM(require("koa-bodyparser"));
var import_koa_compress = __toESM(require("koa-compress"));
var import_koa_logger = __toESM(require("koa-logger"));
var import_koa_mount = __toESM(require("koa-mount"));

// src/server/middlewares/auth.ts
var import_koa_authentication = require("@winwin/koa-authentication");
var import_tsyringe6 = require("tsyringe");

// src/shared/account-storage-service.ts
var import_crypto_js = require("crypto-js");
var import_tsyringe4 = require("tsyringe");
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
      return false;
    }
    if (this._encrypt(password) !== info.password) {
      return false;
    }
    return true;
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

// src/server/middlewares/auth.ts
var auth = (0, import_koa_authentication.createAuth)({
  verify(username, password) {
    const account = import_tsyringe6.container.resolve(AccountService);
    return account.verify(username, password);
  },
  secret() {
    return import_tsyringe6.container.resolve(AuthStorageService).getSecret();
  }
});
auth.router.post("/password", auth.auth, (ctx) => {
  const account = import_tsyringe6.container.resolve(AccountService);
  const { oldPassword, password } = ctx.request.body;
  const verified = account.verify(ctx.state.user.username, oldPassword);
  if (!verified)
    throw new import_koa_authentication.AuthenticationError();
  account.setPassword(password);
  ctx.status = 200;
});
auth.router.post("/username", auth.auth, (ctx, next) => {
  const account = import_tsyringe6.container.resolve(AccountService);
  const { username } = ctx.request.body;
  account.setUsername(username);
  ctx.state.user.username = username;
  return next();
}, auth.cookie, (ctx) => ctx.status = 200);

// src/server/middlewares/statics.ts
var import_path5 = __toESM(require("path"));
var import_koa_static = __toESM(require("koa-static"));
var ROOT = import_path5.default.resolve(process.cwd(), "../web/dist");
var statics = (0, import_koa_static.default)(ROOT, {
  setHeaders: (res, fullpath) => {
    const isHtml = import_path5.default.extname(fullpath).toLowerCase() === ".html";
    if (isHtml)
      res.setHeader("Cache-Control", "no-cache");
    else
      res.setHeader("Cache-Control", "max-age=31536000");
  }
});

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

// src/server/routes/index.ts
var import_router7 = __toESM(require("@koa/router"));

// src/server/routes/install.ts
var import_router = __toESM(require("@koa/router"));
var import_tsyringe8 = require("tsyringe");

// src/server/services/install-service.ts
var import_tsyringe7 = require("tsyringe");
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
  (0, import_tsyringe7.injectable)(),
  (0, import_tsyringe7.singleton)(),
  __decorateParam(0, (0, import_tsyringe7.inject)(StorageService)),
  __decorateParam(1, (0, import_tsyringe7.inject)(AccountService)),
  __decorateParam(2, (0, import_tsyringe7.inject)(AuthStorageService)),
  __decorateParam(3, (0, import_tsyringe7.inject)(LogService))
], InstallService);

// src/server/routes/install.ts
var router = new import_router.default();
router.prefix("/install");
router.get("/", (ctx) => {
  const service = import_tsyringe8.container.resolve(InstallService);
  if (service.isInstalled()) {
    ctx.status = 404;
  } else {
    ctx.status = 200;
    ctx.body = "Waiting For Install";
  }
});
router.post("/", async (ctx) => {
  const service = import_tsyringe8.container.resolve(InstallService);
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
var install_default = router;

// src/server/routes/health.ts
var import_router2 = __toESM(require("@koa/router"));
var router2 = new import_router2.default();
router2.get("/health", (ctx) => {
  ctx.status = 200;
});
var health_default = router2;

// src/server/routes/hexo.ts
var import_tsyringe12 = require("tsyringe");
var import_router3 = __toESM(require("@koa/router"));

// src/server/services/hexo-service.ts
var import_path8 = __toESM(require("path"));
var import_tsyringe11 = require("tsyringe");
var import_fs4 = __toESM(require("fs"));

// ../../node_modules/execa/index.js
var import_node_buffer = require("buffer");
var import_node_path2 = __toESM(require("path"), 1);
var import_node_child_process = __toESM(require("child_process"), 1);
var import_node_process3 = __toESM(require("process"), 1);
var import_cross_spawn = __toESM(require_cross_spawn(), 1);

// ../../node_modules/strip-final-newline/index.js
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

// ../../node_modules/npm-run-path/index.js
var import_node_process2 = __toESM(require("process"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_url = __toESM(require("url"), 1);

// ../../node_modules/npm-run-path/node_modules/path-key/index.js
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

// ../../node_modules/npm-run-path/index.js
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

// ../../node_modules/execa/node_modules/mimic-fn/index.js
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

// ../../node_modules/execa/node_modules/onetime/index.js
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

// ../../node_modules/human-signals/build/src/main.js
var import_os2 = require("os");

// ../../node_modules/human-signals/build/src/realtime.js
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

// ../../node_modules/human-signals/build/src/signals.js
var import_os = require("os");

// ../../node_modules/human-signals/build/src/core.js
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

// ../../node_modules/human-signals/build/src/signals.js
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

// ../../node_modules/human-signals/build/src/main.js
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

// ../../node_modules/execa/lib/error.js
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

// ../../node_modules/execa/lib/stdio.js
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

// ../../node_modules/execa/lib/kill.js
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
  const timeoutPromise = new Promise((resolve4, reject) => {
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

// ../../node_modules/execa/node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}

// ../../node_modules/execa/lib/stream.js
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

// ../../node_modules/execa/lib/promise.js
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
var getSpawnedPromise = (spawned) => new Promise((resolve4, reject) => {
  spawned.on("exit", (exitCode, signal) => {
    resolve4({ exitCode, signal });
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

// ../../node_modules/execa/lib/command.js
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
var SPACES_REGEXP = / +/g;
var parseCommand = (command) => {
  const tokens = [];
  for (const token of command.trim().split(SPACES_REGEXP)) {
    const previousToken = tokens[tokens.length - 1];
    if (previousToken && previousToken.endsWith("\\")) {
      tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
    } else {
      tokens.push(token);
    }
  }
  return tokens;
};

// ../../node_modules/execa/index.js
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
function execaCommand(command, options) {
  const [file, ...args] = parseCommand(command);
  return execa(file, args, options);
}

// src/server/utils/exec.ts
var import_tsyringe9 = require("tsyringe");
var execLogService = import_tsyringe9.container.resolve(LogService);
execLogService.setScope("exec-service");
async function run(command, args = [], opt) {
  execLogService.log(`run ${command} ${args.join(" ")}`);
  return (await execa(command, args, __spreadProps(__spreadValues({}, opt), { stdio: "pipe" }))).stdout;
}

// src/server/utils/hexo.ts
var toPost = (post) => post;
var toPage = (post) => post;
var toCategory = (post) => post;
var toTag = (post) => post;

// src/shared/store.ts
var import_path7 = require("path");
var import_reactivity2 = __toESM(require_reactivity());

// ../../node_modules/@winwin/server-reactive-store/dist/index.mjs
var import_reactivity = __toESM(require_reactivity(), 1);
var import_watch = __toESM(require_dist(), 1);
var import_fs3 = require("fs");
var import_path6 = require("path");
var import_simple_json_db2 = __toESM(require("simple-json-db"), 1);
var JSONdbStorageAdapter = class {
  constructor(root, name = "database.json") {
    if (!(0, import_fs3.existsSync)(root))
      (0, import_fs3.mkdirSync)(root);
    this.db = new import_simple_json_db2.default((0, import_path6.resolve)(root, name));
  }
  getItem(key) {
    return this.db.get(key);
  }
  setItem(key, value) {
    this.db.set(key, value);
  }
  removeItem(key) {
    return this.db.delete(key);
  }
};
function createStore(key, adapter, setup, {
  saveAfterCreate = true
} = {}) {
  const all = setup();
  if (!all.state)
    throw new Error("must return object with state property");
  const state = (0, import_reactivity.reactive)(all.state);
  const load = () => {
    const loaded = adapter.getItem(key);
    if (loaded)
      Object.assign(state, loaded);
  };
  load();
  const save = () => adapter.setItem(key, state);
  (0, import_watch.watch)(state, save, { deep: true, immediate: saveAfterCreate });
  return __spreadProps(__spreadValues({}, all), { load, save, state });
}
function createStoreCreator(adapter) {
  return function(key, setup) {
    return createStore(key, adapter, setup);
  };
}

// src/shared/store.ts
var ROOT2 = (0, import_path7.resolve)(process.cwd(), "data");
var NAME = "database.json";
var createStore2 = createStoreCreator(new JSONdbStorageAdapter(ROOT2, NAME));
var scriptStore = createStore2("script", () => {
  const state = (0, import_reactivity2.reactive)({
    items: {}
  });
  const keys = (0, import_reactivity2.computed)(() => Object.keys(state.items));
  const getScript = (key) => {
    var _a;
    return ((_a = state.items[key]) == null ? void 0 : _a.value) || "";
  };
  const hasScript = (key) => {
    var _a;
    return (_a = state.items[key]) == null ? void 0 : _a.value;
  };
  const setScript = (key, script) => {
    state.items[key] = { value: script };
  };
  return { state, keys, getScript, setScript, hasScript };
});

// src/server/services/exec-service.ts
var import_tsyringe10 = require("tsyringe");
var ExecService = class {
  constructor(_storage, _logService) {
    this._storage = _storage;
    this._logService = _logService;
    this._logService.setScope("exec-service");
  }
  _getCwd() {
    return this._storage.get(HexoInstanceService.HEXO_BASE_DIR_KEY);
  }
  async run(command) {
    if (!command)
      return;
    const cwd = toRealPath(this._getCwd());
    return execaCommand(command, { cwd, stdio: "inherit" });
  }
};
ExecService = __decorateClass([
  (0, import_tsyringe10.injectable)(),
  (0, import_tsyringe10.singleton)(),
  __decorateParam(0, (0, import_tsyringe10.inject)(StorageService)),
  __decorateParam(1, (0, import_tsyringe10.inject)(LogService))
], ExecService);

// src/server/services/hexo-service.ts
function transformPost(doc) {
  var _a, _b, _c, _d;
  return __spreadProps(__spreadValues({}, doc), {
    slug: doc.slug,
    date: doc.date.toString(),
    updated: (_a = doc.updated) == null ? void 0 : _a.toString(),
    prev: (_b = doc.prev) == null ? void 0 : _b.source,
    next: (_c = doc.next) == null ? void 0 : _c.source,
    tags: doc.tags.data.map((t) => t.slug),
    categories: (_d = doc.categories) == null ? void 0 : _d.data.map((c) => c.slug),
    brief: doc._content.slice(0, BRIEF_LENGTH)
  });
}
function transformPostToBrief(_a) {
  var _b = _a, {
    _content,
    content,
    raw
  } = _b, doc = __objRest(_b, [
    "_content",
    "content",
    "raw"
  ]);
  return __spreadProps(__spreadValues({}, doc), { brief: _content.slice(0, BRIEF_LENGTH) });
}
function transformPage(doc) {
  var _a, _b, _c;
  return __spreadProps(__spreadValues({}, doc), {
    slug: doc.slug,
    date: doc.date.toString(),
    updated: (_a = doc.updated) == null ? void 0 : _a.toString(),
    prev: (_b = doc.prev) == null ? void 0 : _b.source,
    next: (_c = doc.next) == null ? void 0 : _c.source,
    brief: doc._content.slice(0, BRIEF_LENGTH)
  });
}
function transformPageToBrief(_a) {
  var _b = _a, {
    _content,
    content,
    raw
  } = _b, doc = __objRest(_b, [
    "_content",
    "content",
    "raw"
  ]);
  return __spreadProps(__spreadValues({}, doc), { brief: _content.slice(0, BRIEF_LENGTH) });
}
var HexoService = class {
  constructor(_logService, _hexoInstanceService, _execService) {
    this._logService = _logService;
    this._hexoInstanceService = _hexoInstanceService;
    this._execService = _execService;
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
      import_fs4.default.writeFileSync(fullPath, content);
    } catch (e) {
      this._logService.error("fail to write file");
      throw e;
    }
  }
  deleteFile(fullPath) {
    try {
      import_fs4.default.rmSync(fullPath);
    } catch (e) {
      this._logService.error("fail to delete file");
      throw e;
    }
  }
  async getFullPathBySource(source, type) {
    var _a, _b;
    const hexo = await this._hexoInstanceService.getInstance();
    if (type === "post")
      return (_a = hexo.locals.get("posts").toArray().find((item) => item.source === source)) == null ? void 0 : _a.full_source;
    else
      return (_b = hexo.locals.get("pages").toArray().find((item) => item.source === source)) == null ? void 0 : _b.full_source;
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
      return;
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
      throw new PostOrPageNotFoundError("page");
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
    if (scriptStore.hasScript("hexo-deploy")) {
      await this._execService.run(scriptStore.getScript("hexo-deploy")).catch((err) => {
        this._logService.error(err);
        throw new ScriptError("fail to run hexo deploy script", "HexoDeployScriptError");
      });
      return;
    }
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
    if (scriptStore.hasScript("hexo-generate")) {
      await this._execService.run(scriptStore.getScript("hexo-generate")).catch((err) => {
        this._logService.error(err);
        throw new ScriptError("fail to run hexo generate script", "HexoGenerateScriptError");
      });
      return;
    }
    const {
      deploy = false,
      watch: watch2 = false,
      bail = false,
      force = false,
      concurrency = false
    } = options;
    const args = [];
    if (deploy)
      args.push("--deploy");
    if (watch2)
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
    if (scriptStore.hasScript("hexo-clean")) {
      await this._execService.run(scriptStore.getScript("hexo-clean")).catch((err) => {
        this._logService.error(err);
        throw new ScriptError("fail to run hexo clean script", "HexoCleanScriptError");
      });
      return;
    }
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
    const res = await this.WithCategoriesTagsBriefArticleList(article);
    this._logService.log(`publish ${filename} with layout: ${layout}`);
    return res;
  }
  async create(title, options = {}) {
    const args = ["new"];
    if (options.layout)
      args.push(options.layout);
    if (options.path) {
      const base = await this._hexoInstanceService.getBaseDir();
      const fullPath = import_path8.default.resolve(base, options.path);
      const relative = import_path8.default.relative(fullPath, base);
      if (!relative.startsWith("..")) {
        this._logService.error(`${fullPath} is not valid`);
        throw new InvalidOptionsError(`${options.path} is not inside hexo blog folder`, "InvalidCreatePathError");
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
      throw new PostOrPageNotFoundError(type);
    this._hexoInstanceService.runBetweenReload(() => {
      this.writeFile(fullPath, raw);
    });
    const article = await this.getPostBySource(source);
    return this.WithCategoriesTagsBriefArticleList(article);
  }
  async delete(source, type) {
    const fullPath = await this.getFullPathBySource(source, type);
    if (!fullPath)
      throw new PostOrPageNotFoundError(type);
    await this._hexoInstanceService.runBetweenReload(async () => {
      await this.deleteFile(fullPath);
    });
    return this.WithCategoriesTagsBriefArticleList(void 0);
  }
};
HexoService = __decorateClass([
  (0, import_tsyringe11.injectable)(),
  (0, import_tsyringe11.singleton)(),
  __decorateParam(0, (0, import_tsyringe11.inject)(LogService)),
  __decorateParam(1, (0, import_tsyringe11.inject)(HexoInstanceService)),
  __decorateParam(2, (0, import_tsyringe11.inject)(ExecService))
], HexoService);

// src/server/routes/hexo.ts
var router3 = new import_router3.default();
router3.prefix("/hexo");
router3.get("/posts", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  ctx.body = await hexo.listPost();
});
router3.get("/post/:source", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source`";
  }
  const post = await hexo.getPostBySource(decodeURIComponent(source));
  if (!post)
    throw new PostOrPageNotFoundError("post");
  ctx.body = post;
});
router3.get("/pages", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  ctx.body = await hexo.listPage();
});
router3.get("/page/:source", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source`";
  }
  ctx.body = await hexo.getPageBySource(decodeURIComponent(source));
});
router3.get("/tags", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  ctx.body = await hexo.listTag();
});
router3.get("/categories", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  ctx.body = await hexo.listCategory();
});
router3.post("/deploy", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  await hexo.deploy(ctx.request.body);
  ctx.status = 200;
});
router3.post("/generate", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  await hexo.generate(ctx.request.body);
  ctx.status = 200;
});
router3.post("/clean", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  await hexo.clean();
  ctx.status = 200;
});
router3.post("/publish", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  const { filename, layout } = ctx.request.body;
  if (!filename) {
    ctx.status = 400;
    ctx.body = "need `filename`";
    return;
  }
  ctx.body = await hexo.publish(filename, layout);
});
router3.post("/create", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  const { title, layout, path: path8, slug, replace } = ctx.request.body;
  if (!title) {
    ctx.status = 400;
    ctx.body = "need `title`";
    return;
  }
  ctx.body = await hexo.create(title, { layout, path: path8, slug, replace });
});
router3.put("/post/:source", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
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
  const hexo = import_tsyringe12.container.resolve(HexoService);
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
  const hexo = import_tsyringe12.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source` ";
    return;
  }
  ctx.body = await hexo.delete(source, "post");
});
router3.delete("/page/:source", async (ctx) => {
  const hexo = import_tsyringe12.container.resolve(HexoService);
  const { source } = ctx.params;
  if (!source) {
    ctx.status = 400;
    ctx.body = "need `source` ";
    return;
  }
  ctx.body = await hexo.delete(source, "page");
});
var hexo_default = router3;

// src/server/routes/git.ts
var import_tsyringe14 = require("tsyringe");
var import_router4 = __toESM(require("@koa/router"));

// src/server/services/git-service.ts
var import_tsyringe13 = require("tsyringe");
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
  constructor(storage2, _logService, _execService) {
    this.storage = storage2;
    this._logService = _logService;
    this._execService = _execService;
    this._logService.setScope("git-service");
  }
  async sync() {
    if (scriptStore.hasScript("git-sync"))
      return this._execService.run(scriptStore.getScript("git-sync")).catch((err) => {
        this._logService.error(err);
        throw new ScriptError("fail to run git sync script", "GitSyncScriptError");
      });
    const base = this.storage.get(HexoInstanceService.HEXO_BASE_DIR_KEY);
    const cwd = toRealPath(base);
    if (!await hasRepo(cwd)) {
      this._logService.log("not git repo, skipped");
      return;
    }
    await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
      this._logService.error(err);
      this._logService.error("git reset hard error");
      throw err;
    });
    this._logService.log("git reset succeed");
    if (await hasRemtoe(cwd)) {
      await run("git", ["pull"], { cwd }).catch((err) => {
        this._logService.error(err);
        this._logService.error("git pull error");
        throw err;
      });
    } else {
      this._logService.log("no remote detected, skip pull");
    }
    this._logService.log("sync succeed");
  }
  async save() {
    if (scriptStore.hasScript("git-save"))
      return this._execService.run(scriptStore.getScript("git-save")).catch((err) => {
        this._logService.error(err);
        throw new ScriptError("fail to run git save script", "GitSaveScriptError");
      });
    const base = this.storage.get(HexoInstanceService.HEXO_BASE_DIR_KEY);
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
      throw err;
    });
    this._logService.log("git add succeed");
    await run("git", ["commit", "-m", `server update ${new Date().toString()}`], { cwd }).catch((err) => {
      this._logService.error(err);
      this._logService.error("git commit error");
      throw err;
    });
    this._logService.log("git commit succeed");
    if (await hasRemtoe(cwd)) {
      await run("git", ["push"], { cwd }).catch((err) => {
        this._logService.error(err);
        this._logService.error("git push error");
        throw err;
      });
    } else {
      this._logService.log("no remote detected, skip push");
    }
    this._logService.log("save succeed");
  }
};
GitService = __decorateClass([
  (0, import_tsyringe13.injectable)(),
  (0, import_tsyringe13.singleton)(),
  __decorateParam(0, (0, import_tsyringe13.inject)(StorageService)),
  __decorateParam(1, (0, import_tsyringe13.inject)(LogService)),
  __decorateParam(2, (0, import_tsyringe13.inject)(ExecService))
], GitService);

// src/server/routes/git.ts
var router4 = new import_router4.default();
router4.prefix("/git");
router4.post("/sync", async (ctx) => {
  const git = import_tsyringe14.container.resolve(GitService);
  await git.sync();
  ctx.status = 200;
});
router4.post("/save", async (ctx) => {
  const git = import_tsyringe14.container.resolve(GitService);
  await git.save();
  ctx.status = 200;
});
var git_default = router4;

// src/server/routes/settings.ts
var import_tsyringe16 = require("tsyringe");
var import_router5 = __toESM(require("@koa/router"));

// src/server/services/settings-service.ts
var import_tsyringe15 = require("tsyringe");
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
  (0, import_tsyringe15.injectable)(),
  (0, import_tsyringe15.singleton)(),
  __decorateParam(0, (0, import_tsyringe15.inject)(StorageService))
], SettingsService);

// src/server/routes/settings.ts
var router5 = new import_router5.default();
router5.get("/settings", async (ctx) => {
  const settingsService = import_tsyringe16.container.resolve(SettingsService);
  ctx.body = await settingsService.get();
});
router5.post("/settings", async (ctx) => {
  var _a;
  const settingsService = import_tsyringe16.container.resolve(SettingsService);
  const settings = (_a = ctx.request.body) != null ? _a : {};
  await settingsService.set(settings);
  ctx.status = 200;
});
var settings_default = router5;

// src/server/routes/template.ts
var import_router6 = __toESM(require("@koa/router"));
var import_tsyringe18 = require("tsyringe");

// src/server/services/frontmatter-template-service.ts
var import_tsyringe17 = require("tsyringe");
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
  (0, import_tsyringe17.injectable)(),
  (0, import_tsyringe17.singleton)(),
  __decorateParam(0, (0, import_tsyringe17.inject)(StorageService))
], FrontmatterTemplateService);

// src/server/routes/template.ts
var router6 = new import_router6.default();
router6.prefix("/template");
router6.get("/frontmatter", async (ctx) => {
  const frontmatterTemplateService = import_tsyringe18.container.resolve(FrontmatterTemplateService);
  const items = await frontmatterTemplateService.list();
  ctx.body = { items };
});
router6.post("/frontmatter", async (ctx) => {
  var _a;
  const items = (_a = ctx.request.body) == null ? void 0 : _a.items;
  if (!items)
    throw new InvalidOptionsError("`raw` is required");
  const frontmatterTemplateService = import_tsyringe18.container.resolve(FrontmatterTemplateService);
  await frontmatterTemplateService.set(items);
  ctx.status = 200;
  ctx.body = { message: "OK" };
});
var template_default = router6;

// src/server/middlewares/install.ts
var import_tsyringe19 = require("tsyringe");
var checkInstall = () => async (ctx, next) => {
  const service = import_tsyringe19.container.resolve(InstallService);
  if (!service.isInstalled()) {
    ctx.status = 404;
    ctx.body = "Install required";
  } else
    await next();
};

// src/server/routes/index.ts
var router7 = new import_router7.default();
router7.use(install_default.routes());
router7.use(checkInstall());
router7.use(auth.auth);
router7.use(health_default.routes());
router7.use(hexo_default.routes());
router7.use(git_default.routes());
router7.use(settings_default.routes());
router7.use(template_default.routes());
var routes_default = router7;

// src/server/app.ts
var logService = import_tsyringe20.container.resolve(LogService);
logService.setScope("app");
var app = new import_koa.default();
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    const err = e instanceof Error ? e : new Error(e);
    const status = err.status || 500;
    const message = err.message || "internal server error";
    const id = err.id || "UnkownError";
    ctx.status = status;
    ctx.body = { status, message, id };
    if (status === 500)
      logService.error(err);
  }
});
app.use((0, import_koa_bodyparser.default)());
app.use((0, import_koa_compress.default)());
app.use(http_secure_default());
app.use((0, import_koa_logger.default)());
app.use((0, import_koa_mount.default)("/", statics));
app.use(auth.router.routes());
app.use(routes_default.routes());
var app_default = app;

// src/server/index.ts
var storage = import_tsyringe21.container.resolve(StorageService);
var server = import_http.default.createServer(app_default.callback());
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.log("Server running on " + bind);
  const his = import_tsyringe21.container.resolve(HexoInstanceService);
  his.init().catch(console.error);
});
server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT);
