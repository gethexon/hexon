/**
 * setup polyfill
 */

import "reflect-metadata";
import { container } from "tsyringe";
import { StorageService, StorageServiceIdentifier } from "./services/storage";
import { TokenService, TokenServiceIdentifier } from "./services/token";

/**
 * setup di
 * @see https://github.com/microsoft/tsyringe
 */

container.register(StorageServiceIdentifier, {
  useClass: StorageService,
});

container.register(TokenServiceIdentifier, {
  useClass: TokenService,
});
