<template>
    <div class="editor-container">
        <div class="toolbar">
            <button @click="addNode">添加节点</button>
            <button @click="exportData">导出规则 JSON</button>
        </div>
        <el-splitter layout="vertical">
            <el-splitter-panel>
                <div ref="containerRef" class="flow-container"></div>
            </el-splitter-panel>
            <el-splitter-panel size="20%">
                我是节点数据展示区域
            </el-splitter-panel>
        </el-splitter>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LogicFlow from '@logicflow/core';
import "@logicflow/core/lib/style/index.css";
const containerRef = ref<HTMLDivElement | null>(null);
let lf: LogicFlow;

onMounted(() => {
    lf = new LogicFlow({
        container: containerRef.value!,
        grid: true,
    });
    lf.render({ nodes: [], edges: [] });
});

function addNode() {
    lf.addNode({
        id: String(Date.now()),
        type: 'rect',
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
        text: '新节点',
        width: 100,
        height: 40,
    });
}

function exportData() {
    const data = lf.getGraphData();
    console.log('导出的 JSON 数据:', data);
    alert('已输出到控制台');
}
</script>

<style scoped lang="less">
.editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.toolbar {
    padding: 10px;
    background: #f5f5f5;
}

.flow-container {
    height: 100%;
    width: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
</style>
