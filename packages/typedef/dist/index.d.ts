export declare enum ERROR_CODE {
    E_INIT = 0,
    E_INITIATING = 1,
    E_UNKNOWN = 2,
    E_NOT_FOUND = 3,
    E_INVALID_CREATE_OPTION_PATH = 4
}
export interface IErrorResponse {
    code: ERROR_CODE;
    message: string;
}
export declare function createErrorResponse(code: ERROR_CODE, message: string): {
    code: ERROR_CODE;
    message: string;
};
