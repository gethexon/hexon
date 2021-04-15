export async function init({ dispatch, rootState }) {
  if (rootState.user.alive)
    await Promise.all([
      dispatch('hexo/listPosts'),
      dispatch('hexo/listPages'),
      dispatch('hexo/listTags'),
      dispatch('hexo/listCategories')
    ])
}
