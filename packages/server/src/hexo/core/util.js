import fs from "fs";
import path from "path";
export const restrictedKeys = [
    '_content',
    'tags',
    'category',
    'categories',
    'title',
    'date',
    'updated',
    'layout'
];
export const checkIsBlog = cwd => {
    let file;
    try {
        // 检查是否有对应文件
        file = fs.readFileSync(path.join(cwd, 'package.json'));
        fs.readFileSync(path.join(cwd, '_config.yml'));
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw err;
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file);
    if (!packageJSON.dependencies.hexo)
        return false;
    return true;
};
