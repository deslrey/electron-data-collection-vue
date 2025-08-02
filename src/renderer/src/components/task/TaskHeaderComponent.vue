<template>
    <div>
        <div class="taskheader-layout">
            <div class="taskheader-layout-icon">
                <AntIcon type="icon-91jiazai" />
            </div>
            <div class="taskheader-layout-input">
                <el-input v-model="input" placeholder="Please input" />
            </div>
            <div class="taskheader-layout-button">
                <el-button>
                    <AntIcon type="icon-shanchu1" />
                </el-button>
                <el-switch v-model="preview" :active-action-icon="View" :inactive-action-icon="Hide"
                    :active-value="true" :inactive-value="false" />
                <span>预览模式</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AntIcon from '@renderer/utils/AntIcon';
import { ref } from 'vue'
import { Hide, View } from '@element-plus/icons-vue'

const input = ref<string>('')
const preview = ref<boolean>(true)

</script>

<style scoped lang="less">
.taskheader-layout {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 48px;
    padding: 0 12px;
    gap: 8px;

    .taskheader-layout-icon {
        display: flex;
        align-items: center;
    }

    .taskheader-layout-input {
        flex: 1;
    }

    .taskheader-layout-button {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 8px;
    }


}
</style>