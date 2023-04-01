import "reflect-metadata"
import * as dotenv from "dotenv"
import { container } from "tsyringe"
import http from "http"
import { HEXON_DEFAULT_PORT, HEXON_PORT_KEY } from "~/shared/constants"
import { StorageService } from "~/shared/storage-service"
import { HexoInstanceService } from "@/services/hexo-instance-service"
import app from "@/app"
import path from "path"
import { EnvService } from "~/shared/env-service"
;(async () => {
  dotenv.config({
    path:
      process.env.NODE_ENV === "production"
        ? process.cwd() + "/.env"
        : path.resolve(process.cwd(), "../.env"),
  })
  const storage = container.resolve<StorageService>(StorageService)
  const server = http.createServer(app.callback())
  server.on("listening", () => {
    const addr = server.address()
    const bind =
      typeof addr === "string"
        ? "pipe " + addr
        : "http://localhost:" + addr!.port
    console.log("Server running on " + bind)
    const his = container.resolve(HexoInstanceService)
    his.init().catch(console.error)
  })
  const env = container.resolve<EnvService>(EnvService)
  await env.sync()
  server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT)
})()
