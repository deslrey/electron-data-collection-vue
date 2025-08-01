import { title } from 'process'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const asideRoutes: RouteRecordRaw[] = [
  {
    path: 'home',
    name: 'Home',
    component: () => import('@renderer/views/HomeVIew.vue'),
    meta: { title: '主页', icon: 'icon-shanchu2' }
  },
  {
    path: 'list',
    name: 'List',
    component: () => import('@renderer/views/ListView.vue'),
    meta: { title: '列表', icon: 'icon-shanchu2' }
  },
  {
    path: 'task',
    name: 'Task',
    component: () => import('@renderer/views/TaskView.vue'),
    meta: { title: '任务', icon: 'icon-shanchu2' }
  },
  {
    path: 'test',
    name: 'Test',
    component: () => import('@renderer/views/TestView.vue'),
    meta: { title: '测试', icon: 'icon-shanchu2' }
  },
  {
    path: 'table',
    name: 'Table',
    meta: { title: '列表', icon: 'icon-shanchu2' },
    children: [
      {
        path: 'table-1',
        name: 'Table-1',
        meta: { title: '表格-1', icon: 'icon-shanchu2' },
        children: [
          {
            path: 'table-1-1',
            name: 'Table-1-1',
            component: () => import('@renderer/views/tables/tables-1/Table_1_1.vue'),
            meta: { title: '表格-1-1', icon: 'icon-shanchu2' }
          },
          {
            path: 'table-1-2',
            name: 'Table-1-2',
            component: () => import('@renderer/views/tables/tables-1/Table_1_2.vue'),
            meta: { title: '表格-1-2', icon: 'icon-shanchu2' }
          }
        ]
      },
      {
        path: 'table-2',
        name: 'Table-2',
        meta: { title: '表格-2', icon: 'icon-shanchu2' },
        children: [
          {
            path: 'table-2-1',
            name: 'Table-2-1',
            component: () => import('@renderer/views/tables/tables-2/Table_2_1.vue'),
            meta: { title: '表格-2-1', icon: 'icon-shanchu2' }
          },
          {
            path: 'table-2-2',
            name: 'Table-2-2',
            component: () => import('@renderer/views/tables/tables-2/Table_2_2.vue'),
            meta: { title: '表格-2-2', icon: 'icon-shanchu2' }
          }
        ]
      }
    ]
  },
  {
    path: 'user',
    name: 'User',
    component: () => import('@renderer/views/UserVIew.vue'),
    meta: { title: '用户', icon: 'icon-shanchu2' }
  }
]

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
