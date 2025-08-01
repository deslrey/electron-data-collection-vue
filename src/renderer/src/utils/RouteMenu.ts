// @/utils/RouteToMenu.ts
import { MenuItem } from '@renderer/interfaces/MenuItem'
import type { RouteRecordRaw } from 'vue-router'

const defaultIcon = 'icon-shanchu2'

export function generateMenus(routes: RouteRecordRaw[], basePath = ''): MenuItem[] {
  const result: MenuItem[] = []

  for (const route of routes) {
    // 拼接完整路径
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${basePath}/${route.path}`.replace(/\/+/g, '/') // 防止出现多个斜杠

    if (route.children) {
      const childrenMenus = generateMenus(route.children, fullPath)

      if (route.meta?.title) {
        result.push({
          name: route.meta.title as string,
          path: fullPath,
          icon: route.meta.icon as string,
          children: childrenMenus
        })
      } else {
        // 没有 title，直接把子菜单放上来
        result.push(...childrenMenus)
      }
    } else if (route.meta?.title && !route.meta.hidden) {
      result.push({
        name: route.meta.title as string,
        path: fullPath,
        icon: route.meta.icon as string
      })
    }
  }

  return result
}
