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
  return async (ctx: Context, next: Next) => {
    if (typeof enable === "function" ? !enable() : !enable) {
      await next();
      return;
    }
    if (isGetPublicKeyRoute(ctx)) {
      ctx.body = publicKey;
      return;
    }
    const prefix = "/secure/";
    const enced = decodeURIComponent(ctx.path.slice(prefix.length));
    const secured = ctx.path.startsWith(prefix);

    if (secured) {
      const decoded = JSON.parse(decryptRSA(enced) || "");
      ctx.path = decoded.url;
      const key = decoded.key;
      ctx.originalUrl = "[secure]" + ctx.path;
      const { content } = ctx.request.body;
      if (content)
        ctx.request.body = JSON.parse(
          decryptAES(ctx.request.body.content, key)
        );
      await next();
      if (ctx.body) {
        const content = encryptAES(JSON.stringify(ctx.body), key);
        ctx.body = { content };
      }
    } else {
      await next();
      return;
    }
  };
}

export default secure;
