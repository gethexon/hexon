import { NotFound, BadRequest } from "http-errors"

export class PostOrPageNotFoundError extends NotFound {
  constructor(type: "post" | "page", msg?: string) {
    super(msg ?? `${type} not found`)
  }
}

export class InvalidOptionsError extends BadRequest {}
