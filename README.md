# Hexon

## 🎉 New Name

winwin-hexo-editor has been renamed to Hexon witch means hexo online. Wish you love it!

## ⭐️ Features

- Post and page management
- Front-matter template
- ~~Online image management~~ use [imageur](https://github.com/YuJianghao/imageur)

## 📘 Guide

### Before Install

Make sure your `git`, `hexo` and `Node.js` workflow is fine. Hexon only provide a GUI for these commands, but **not implement them**.

### Install

```bash
git clone https://github.com/gethexon/hexon
pnpm install
pnpm run setup
```

### Uninstall

```bash
rm -rf hexon
# just remove the folder you just cloned
```

### Start

```bash
pnpm start # for plain nodejs
pnpm prd # for pm2
```

### Update

Hexon is still under development, so just reinstall from fresh to avoid errors.

## 💻 Commands

- `pnpm run setup`: install and config
- `pnpm start`: start hexon with node
- `pnpm prd`: start hexon with pm2
- `pnpm resetpwd`: reset password
- `pnpm script`: manage custom script

## 🖥️ Develop

- Check out `develop` branch.
- Run `pnpm dev-init` install dependencies and config hexon.
- Run `pnpm dev` and show your magic!

## 💩 Have trouble?

- Read FAQs below.
- Try to find answer in [issue list](https://github.com/gethexon/hexon/issues).
- Raise an [issue](https://github.com/gethexon/hexon/issues/new).

**TRY NOT ASK QUESTION VIA QQ GROUP. SOLUTIONS IN QQ GROUP WON'T HELP OTHERS.**

## ❓ Want to know more?

Start a [discussion](https://github.com/gethexon/hexon/discussions) or join us via QQ group 590355610.

## 👌🏻 FAQ

### 404 Error

Maybe mistakes in revert proxy config(e.g. Nginx or Apache config). To verify, use `curl` on your server directly request assets without any revert proxy. This should be a command looks like:

```bash
curl http://localhost:5777/assets/HMonacoEditor.5101bbae.js
```

Or hexon failure. Just raise an issue.

## ⏱️ Looking for old version?

Versions under v0.6.x are still available at [winwin-hexo-editor](https://github.com/YuJianghao/winwin-hexo-editor/)

## License

GPL-3.0 © winwin2011
