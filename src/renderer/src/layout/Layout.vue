<template>
    <div class="container-layout">
        <el-container>
            <el-aside class="container-aside">
                <div>Aside</div>
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