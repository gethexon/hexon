import "./bootstrap.ts";
import http from "http";
import app from "./app";

const server = http.createServer(app.callback());
server.on("listening", () => {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.log("Server running on " + bind);
});
server.listen(5777);
