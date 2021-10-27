import http from "http";
import "./bootstrap.ts";
import { container } from "tsyringe";
import app from "./app";
import { StorageService } from "~/shared/storage-service";
import { HEXON_PORT_KEY, HEXON_DEFAULT_PORT } from "~/shared/constants";

const storage = container.resolve(StorageService);
const server = http.createServer(app.callback());
server.on("listening", () => {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.log("Server running on " + bind);
});
server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT);
