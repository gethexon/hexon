/**
 * setup polyfill
 */

import "reflect-metadata";
import { container } from "tsyringe";
import {
  StorageService,
  StorageServiceIdentifier,
} from "~/shared/storage-service";

/**
 * setup di
 * @see https://github.com/microsoft/tsyringe
 */

container.register(StorageServiceIdentifier, {
  useClass: StorageService,
});
