"use strict";
exports.__esModule = true;
require("reflect-metadata");
var tsyringe_1 = require("tsyringe");
var http_1 = require("http");
var constants_1 = require("~/shared/constants");
var storage_service_1 = require("~/shared/storage-service");
var hexo_instance_service_1 = require("@/services/hexo-instance-service");
var app_1 = require("@/app");
var storage = tsyringe_1.container.resolve(storage_service_1.StorageService);
var server = http_1["default"].createServer(app_1["default"].callback());
server.on("listening", function () {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
    console.log("Server running on " + bind);
    var his = tsyringe_1.container.resolve(hexo_instance_service_1.HexoInstanceService);
    his.init();
});
server.listen(storage.get(constants_1.HEXON_PORT_KEY) || constants_1.HEXON_DEFAULT_PORT);
