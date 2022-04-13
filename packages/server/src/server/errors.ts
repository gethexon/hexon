import { NotFound, BadRequest, InternalServerError } from "http-errors"

export class PostOrPageNotFoundError extends NotFound {
  public id = "PostOrPageNotFoundError"
  constructor(type: "post" | "page", msg?: string) {
    super(msg ?? `${type} not found`)
  }
}

export class HexoInitError extends InternalServerError {
  public id = "HexoInitError"
}

export class InvalidOptionsError extends BadRequest {
  constructor(message: string, public id: string = "InvalidOptionsError") {
    super(message)
  }
}
