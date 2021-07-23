import { ILogService, LogService } from "./base/logService.js";
import DI from "./util/di.js";
const logService = new LogService();
DI.setLogger(logService.get('di'));
const ctors = new Map();
ctors.set(ILogService, LogService);
const services = new Map();
services.set(ILogService, logService);
DI.from(ctors, services);
