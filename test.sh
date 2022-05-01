pnpm run build
rm -rf server/data
rm -rf ./**/node_modules
pnpm run setup
echo "
  登录
  登出
  查看文章
  编辑文章
  新建文章
  hexo 三个命令不报错
  git 两个命令不报错
"
pnpm run start
