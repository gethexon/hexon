export enum ERROR_CODE {
  E_INIT,
  E_INITIATING,
  E_UNKNOWN,
  E_NOT_FOUND,
  E_INVALID_CREATE_OPTION_PATH,
}

export interface IErrorResponse {
  code: ERROR_CODE
  message: string
}

export function createErrorResponse(code: ERROR_CODE, message: string) {
  return { code, message }
}

export interface ISettings {
  ui: {
    editor: {
      fontFamily: string
    }
  }
}
