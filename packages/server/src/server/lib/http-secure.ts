import chalk from "chalk";
import crypto from "crypto";
import CryptoJS from "crypto-js";
import { Context, Next } from "koa";
import JSEncrypt from "node-jsencrypt";

function secure(enable = () => true) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  function decryptRSA(data: string) {
    const o = new JSEncrypt();
    o.setPrivateKey(privateKey);
    const res = o.decrypt(data);
    return res;
  }

  function decryptAES(data: string, key: string) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  }

  function encryptAES(data: string, key: string) {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  CryptoJS.AES.encrypt('"hi"', "123").toString();

  function isGetPublicKeyRoute(ctx: Context) {
    return (
      ctx.request.path.startsWith("/publickey") && ctx.request.method === "GET"
    );
  }

  interface IData {
    /**
     * real data passed to axios config.data
     */
    data: any;
  }

  function stringifyData(data: IData): string {
    return JSON.stringify(data);
  }

  function parseData(data: string): IData {
    const str = data;
    return JSON.parse(str);
  }

  return async (ctx: Context, next: Next) => {
    if (typeof enable === "function" ? !enable() : !enable) {
      await next();
      return;
    }
    if (isGetPublicKeyRoute(ctx)) {
      console.log(chalk.white("GET"), chalk.white.dim("/publickey"));
      ctx.body = publicKey;
      return;
    }
    const prefix = "/secure/";
    const enced = decodeURIComponent(ctx.path.slice(prefix.length));
    const secured = ctx.path.startsWith(prefix);

    if (secured) {
      const res = decryptRSA(enced);
      if (!res) {
        ctx.status = 403;
        ctx.body = { code: "EHTTPSECURE" };
        return;
      }
      const decoded = JSON.parse(res);
      ctx.path = decoded.url;
      const key = decoded.key;
      ctx.originalUrl = "[secure]" + ctx.path;

      ctx.request.body =
        ctx.request.method !== "GET" &&
        parseData(decryptAES(ctx.request.body.content, key)).data;
      await next();
      const content = encryptAES(stringifyData({ data: ctx.body }), key);
      ctx.body = { content };
    } else {
      await next();
      return;
    }
  };
}

export default secure;
