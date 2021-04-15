import asyncload from 'src/services/asyncload'

const routes = [
  {
    path: '/',
    component: asyncload.load(() => import('layouts/MainLayout.vue'), 'MainLayout', { page: true }),
    children: [
      {
        path: '', component: asyncload.load(() => import('pages/Index.vue'), 'Index', { page: true }),
        children: [
          { path: '', component: asyncload.load(() => import('components/Panels/WelcomePart.vue'), 'WelcomePart', { index: true }) },
          { path: ':type/:id', component: asyncload.load(() => import('components/Panels/Viewer.vue'), 'Viewer', { index: true }), name: 'view' },
        ]
      },
      { path: ':type/:id/edit', component: asyncload.load(() => import('pages/Editor.vue'), 'Editor', { page: true }), name: 'edit' },
      { path: 'login', component: asyncload.load(() => import('pages/Login.vue'), 'Login', { page: true }) },
      { path: 'install', component: asyncload.load(() => import('pages/Install.vue'), 'Install', { page: true }) }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    redirect: '/'
  }
]

export default routes
