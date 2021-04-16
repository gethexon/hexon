const fs = require('fs')
const path = require('path')

exports.restrictedKeys = [
  '_content',
  'tags',
  'category',
  'categories',
  'title',
  'date',
  'updated',
  'layout'
]

/**
 * 检查指定路径是否是 hexo 博客=
 * 如果没有依赖hexo或者没有 `_config.yml` 则视为不是博客目录
 * @param {String} cwd 待检查的路径
 * @returns
 */
exports.checkIsBlog = cwd => {
  let file
  try {
    // 检查是否有对应文件
    file = fs.readFileSync(path.join(cwd, 'package.json'))
    fs.readFileSync(path.join(cwd, '_config.yml'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
  // 检查是否有hexo依赖
  const packageJSON = JSON.parse(file)
  if (!packageJSON.dependencies.hexo) return false
  return true
}
