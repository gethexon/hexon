import services from "src/services";
import { origin, request } from "./request";
import { encryptPassword } from "./utils";
export default {
  login: async (name, pass) => {
    const res = await origin.post("/auth/signin", undefined, {
      auth: {
        username: name,
        password: encryptPassword(pass)
      }
    });
    services.auth.setAccessToken(res.data.accessToken);
    services.auth.setRefreshToken(res.data.refreshToken);
    return res.data;
  },
  info: async () => {
    return request.get("/auth/info");
  },
  logout: async () => {
    return origin.post(
      "/auth/signout",
      { accessToken: services.auth.getAccessToken() },
      {
        Authorization: `Bearer ${services.auth.getRefreshToken()}`
      }
    );
  },
  refresh: async () => {
    const res = await origin.post("/auth/refresh", undefined, {
      headers: {
        Authorization: "Bearer " + services.auth.getRefreshToken()
      }
    });
    services.auth.setAccessToken(res.data.accessToken);
    services.auth.setRefreshToken(res.data.refreshToken);
  },
  setPassword: async (name, pass, newPass) => {
    return origin.post(
      "/password",
      { password: encryptPassword(newPass) },
      {
        auth: {
          username: name,
          password: encryptPassword(pass)
        }
      }
    );
  }
};
