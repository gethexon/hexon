# Hexon

Let's hexo online! 

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/gethexon/hexon?style=flat-square)](https://github.com/gethexon/hexon/releases/)

## ❔ How it works?

Hexon is a GUI for hexo with git, run commands and manage content for you.

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

Just remove the folder you just cloned

```bash
rm -rf hexon
```

### Start

For plain Node.js:

```bash
pnpm start
```

For better devOps with [pm2](https://pm2.keymetrics.io/)

```bash
pnpm prd
# or integrate pm2 with `pnpm start` manually
```

### Update

Just uninstall the old one and install the new one.

## 💻 Commands

- `pnpm run setup`: install and config
- `pnpm start`: start hexon with node
- `pnpm prd`: start hexon with pm2
- `pnpm resetpwd`: reset password
- `pnpm script`: manage custom script

You can replace hexon commands with your own bash script inside hexo blog folder.

e.g. modify `git sync` script
1. write your script in `<hexo-blog-path>/git_sync.sh`
2. run `pnpm script`
3. select `git sync` 
4. set script to `bash ./git_sync.sh`

## 🖥️ Develop

- Check out `main` branch.
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

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=gethexon/hexon&type=Date)](https://star-history.com/#gethexon/hexon&Date)

## Contributors

<a href="https://github.com/usememos/memos/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=gethexon/hexon" />
</a>

## License

GPL-3.0 © winwin2011
