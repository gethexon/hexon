import DI from "../util/di.js";
import { IHexo } from "./core/hexo.js";
/**
 * 使用正则的简单搜索
 * @param {RegExp} query 搜索正则
 * @param {Object[]} data 数据数组
 * @param {string} key id_key
 * @param {string} content content_key
 * @returns 结果 id 数组
 */
const simpleSearch = (query, data, key, content) => {
    return data
        .filter(record => query.test(record[content]))
        .map(record => record[key]);
};
export const search = async (query, mode = '') => {
    if (!query)
        return [];
    const hexo = DI.inject(IHexo);
    const regexp = new RegExp(query, mode);
    const posts = await hexo.listPost();
    const pages = await hexo.listPage();
    const articles = posts.concat(pages);
    const results = simpleSearch(regexp, articles, '_id', 'raw');
    return results;
};
