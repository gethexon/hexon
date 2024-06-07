pnpm run build
rm -rf server/data
rm -rf ./**/node_modules
pnpm run setup
pnpm run start
