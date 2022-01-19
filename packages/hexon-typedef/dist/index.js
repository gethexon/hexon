'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

exports.ERROR_CODE = void 0;
(function (ERROR_CODE) {
    ERROR_CODE[ERROR_CODE["E_INIT"] = 0] = "E_INIT";
    ERROR_CODE[ERROR_CODE["E_INITIATING"] = 1] = "E_INITIATING";
    ERROR_CODE[ERROR_CODE["E_UNKNOWN"] = 2] = "E_UNKNOWN";
    ERROR_CODE[ERROR_CODE["E_NOT_FOUND"] = 3] = "E_NOT_FOUND";
})(exports.ERROR_CODE || (exports.ERROR_CODE = {}));
function createErrorResponse(code, message) {
    return { code, message };
}

exports.createErrorResponse = createErrorResponse;
