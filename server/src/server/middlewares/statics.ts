import path from "path"
import serve from "koa-static"

const ROOT = path.resolve(process.cwd(), "../web/dist")

export const statics = serve(ROOT, {
  setHeaders: (res, fullpath) => {
    const isHtml = path.extname(fullpath).toLowerCase() === ".html"
    if (isHtml) res.setHeader("Cache-Control", "no-cache")
    else res.setHeader("Cache-Control", "max-age=31536000")
  },
})
