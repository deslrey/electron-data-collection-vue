<template>
    <div class="taskview-layout">
        <el-container>
            <el-splitter>
                <el-splitter-panel>
                    <el-container class="taskview-container">
                        <el-header class="taskview-container-header">
                            <TaskHeaderComponent />
                        </el-header>
                        <div class="taskview-container-splitter">
                            <el-splitter layout="vertical">
                                <el-splitter-panel>
                                    <el-main class="taskview-container-main">
                                        <TaskMainComponent />
                                    </el-main>
                                </el-splitter-panel>
                                <el-splitter-panel size="20%">
                                    <el-footer class="taskview-container-footer">
                                        <TaskFooterComponent />
                                    </el-footer>
                                </el-splitter-panel>
                            </el-splitter>
                        </div>
                    </el-container>
                </el-splitter-panel>
                <el-splitter-panel size="30%">
                    <el-aside class="taskview-container-aside">
                        <TaskAsideComponent />
                    </el-aside>
                </el-splitter-panel>
            </el-splitter>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import TaskHeaderComponent from '@renderer/components/task/TaskHeaderComponent.vue';
import TaskMainComponent from '@renderer/components/task/TaskMainComponent.vue';
import TaskFooterComponent from '@renderer/components/task/TaskFooterComponent.vue';
import TaskAsideComponent from '@renderer/components/task/TaskAsideComponent.vue';

</script>

<style scoped lang="less">
.taskview-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    overflow: hidden;

    .taskview-container {
        height: 100%;
        min-width: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .taskview-container-header {
            flex-shrink: 0;
            padding: 0;
            border-bottom: 1px solid #d0d4db;
        }

        .taskview-container-splitter {
            flex: 1;
            min-width: 0;
            overflow: hidden;

            .taskview-container-main {
                height: 100%;
                min-width: 0;
                overflow: auto;
                padding: 2px;
            }

            .taskview-container-footer {
                height: 100%;
                flex-shrink: 0;
                min-width: 0;
                padding: 2px;

            }
        }

    }

    .taskview-container-aside {
        height: 100%;
        width: 100%;
        min-width: 0;
        overflow: auto;
        padding: 2px;
    }
}
</style>