<template>
    <div class="editor-container">
        <el-splitter layout="vertical">
            <el-splitter-panel>
                <div ref="containerRef" class="flow-container"></div>
            </el-splitter-panel>
            <el-splitter-panel size="20%">
                我是节点数据展示区域
            </el-splitter-panel>
        </el-splitter>

        <!-- 自定义右键菜单 -->
        <div v-if="contextMenuVisible" class="context-menu"
            :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }">
            <ul>
                <li @click="addNode">添加节点</li>
                <li @click="addChildNode">添加子节点</li>
            </ul>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import LogicFlow from '@logicflow/core';
import "@logicflow/core/lib/style/index.css";

// 画布 DOM
const containerRef = ref<HTMLDivElement | null>(null);
let lf: LogicFlow;

// 当前右键点击的节点
const contextNode = ref<any>(null);

// 控制菜单显示
const contextMenuVisible = ref(false);
const contextMenuPosition = reactive({ x: 0, y: 0 });

onMounted(() => {
    lf = new LogicFlow({
        container: containerRef.value!,
        grid: true,
    });

    lf.render({ nodes: [], edges: [] });

    // 监听右键点击节点
    lf.on('node:contextmenu', ({ data, e }) => {
        e.preventDefault();
        contextNode.value = data;
        contextMenuVisible.value = true;
        contextMenuPosition.x = e.clientX;
        contextMenuPosition.y = e.clientY;
    });

    // 监听点击画布隐藏右键菜单
    lf.on('blank:click', () => {
        contextMenuVisible.value = false;
    });

    // 监听鼠标右键画布弹出菜单
    lf.on('blank:contextmenu', ({ e }) => {
        e.preventDefault()
        contextMenuVisible.value = true
        contextMenuPosition.x = e.clientX
        contextMenuPosition.y = e.clientY
    })

    //  监听删除节点事件
    lf.on('node:delete', () => { })

    //  监听删除边事件
    lf.on('edge:delete', () => { })

    //  点击元素事件
    lf.on('node:click', () => { })

    //  鼠标按下节点
    lf.on('node:mousedown', () => { })

    //  鼠标进入节点
    lf.on('node:mouseenter', () => { })

    //  鼠标离开节点	
    lf.on('node:mouseleave', () => { })

});


//  右键菜单添加节点
const addNode = () => {
    const node = {
        id: uuidv4(),
        type: 'rect',
        x: 0,
        y: 0,
        text: '节点',
        width: 100,
        height: 40,
        ports: []
    }
    lf.addNode(node)
    contextMenuVisible.value = false
}

// 右键菜单里添加子节点
function addChildNode() {
    if (!contextNode.value) return;

    const parent = contextNode.value;
    const newId = uuidv4();
    const childNode = {
        id: newId,
        type: 'rect',
        x: parent.x + 150,
        y: parent.y + 80,
        text: '子节点',
        width: 100,
        height: 40,
        ports: [],
    };

    lf.addNode(childNode);
    lf.addEdge({
        sourceNodeId: parent.id,
        targetNodeId: newId,
        type: 'polyline',
    });

    contextMenuVisible.value = false;
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

.context-menu {
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    width: 120px;

    ul {
        list-style: none;
        padding: 4px 0;
        margin: 0;

        li {
            padding: 6px 12px;
            cursor: pointer;
            font-size: 14px;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>
