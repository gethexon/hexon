import "reflect-metadata"
import { container } from "tsyringe"
import http from "http"
import { HEXON_DEFAULT_PORT, HEXON_PORT_KEY } from "~/shared/constants"
import { StorageService } from "~/shared/storage-service"
import app from "./app"

const storage = container.resolve<StorageService>(StorageService)
const server = http.createServer(app.callback())
server.on("listening", () => {
  const addr = server.address()
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port
  console.log("Server running on " + bind)
})
server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT)
