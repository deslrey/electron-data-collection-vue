<template>
    <div class="container-layout">
        <el-container>
            <el-aside class="container-aside">
                <div>
                    <el-menu v-model:openeds="openMenus" :default-active="route.path" class="container-aside-menu"
                        background-color="#f8f8f8" text-color="#333" active-text-color="#4e54c8" router unique-opened>
                        <template v-for="item in menus" :key="item.path">
                            <MenuItem :item="item" />
                        </template>
                    </el-menu>
                </div>
            </el-aside>
            <el-container class="container-right">
                <el-header class="container-header">
                    <div>Header</div>
                </el-header>
                <el-main class="container-main">
                    <div><router-view /></div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { MenuItem } from '@renderer/components/menu/MenuComponent';
import { asideRoutes } from '@renderer/router/inedx';
import { generateMenus } from '@renderer/utils/RouteMenu';
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const menus = generateMenus(asideRoutes)
const route = useRoute()
const openMenus = ref<string[]>([])


watch(() => route.path, (newPath) => {
    const segments = newPath.split('/').filter(Boolean)
    const openPaths: string[] = []
    if (segments.length > 1) {
        openPaths.push('/' + segments[0])
        openPaths.push('/' + segments.slice(0, 2).join('/'))
    } else if (segments.length === 1) {
        openPaths.push('/' + segments[0])
    }
    openMenus.value = openPaths


}, { immediate: true })

</script>

<style scoped lang="less">
@padding : 5px;
@margin : 10px;

.container-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #f5f7fa;

    .container-aside {
        width: 18%;
        padding: @padding;
        background-color: #f8f8f8;
        border-right: 1px solid #d0d4db;
        box-sizing: border-box;

        .container-aside-menu {
            width: 100%;
            border-right: none;
        }
    }

    .container-right {
        flex: 1;

        .container-header {
            height: 5vh;
            padding: @padding;
            background-color: #f8f8f8;
            border-bottom: 1px solid #d0d4db;
            box-sizing: border-box;

        }

        .container-main {
            padding: @padding;
            background-color: #ffffff;
            overflow-y: auto;
        }
    }
}
</style>