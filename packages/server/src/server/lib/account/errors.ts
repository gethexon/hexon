import type { tokenType } from "./types"

export class EmptyAuthticationHeaderError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "EmptyAuthticationHeaderError"
  }
}
export class InvalidAuthticationHeaderError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "InvalidAuthticationHeaderError"
  }
}
export class TokenBlockedError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "TokenBlockedError"
  }
}
export class InvalidTokenError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "InvalidTokenError"
  }
}
export class TokenTypeError extends Error {
  constructor(public readonly expectedType: tokenType) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "TokenTypeError"
  }
}
export class TokenDecodeError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "TokenDecodeError"
  }
}
export class NotBasicAuthError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "NotBasicAuthError"
  }
}
export class BasicAuthError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "BasicAuthError"
  }
}

export class PassworCheckError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = "PassworCheckError"
  }
}
