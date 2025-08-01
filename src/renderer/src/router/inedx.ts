import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const asideRoutes: RouteRecordRaw[] = []

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'deslrey',
    component: () => import('@renderer/layout/Layout.vue'),
    children: asideRoutes
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
