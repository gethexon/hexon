/**
 * setup polyfill
 */

import "reflect-metadata";
import { container } from "tsyringe";
import { StorageService, StorageServiceIdentifier } from "./services/storage";

/**
 * setup di
 * @see https://github.com/microsoft/tsyringe
 */

container.register(StorageServiceIdentifier, {
  useClass: StorageService,
});
