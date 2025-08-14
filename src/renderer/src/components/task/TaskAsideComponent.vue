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
                <li @click="addNode('condition-node')" v-if="contextNode && contextNode.type !== 'end-node'">添加条件节点</li>
                <li @click="addChildNode('condition-true-node')" v-if="contextNode && contextNode.type !== 'end-node'">
                    添加条件正确子节点</li>
                <li @click="addChildNode('condition-false-node')" v-if="contextNode && contextNode.type !== 'end-node'">
                    添加条件错误子节点</li>
                <li @click="addNode('end-node')" v-if="contextNode && contextNode.type !== 'end-node'">添加结束节点</li>
                <li @click="deleteNode">删除节点</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import LogicFlow from '@logicflow/core';
import "@logicflow/core/lib/style/index.css";

import {
    StartNodeModel, StartNode,
    ConditionNodeModel, ConditionNode,
    ConditionTrueNodeModel, ConditionTrueNode,
    ConditionFalseNodeModel, ConditionFalseNode,
    EndNodeModel, EndNode
} from '@renderer/node/Nodes';
import message from '@renderer/utils/Message';

// 画布 DOM
const containerRef = ref<HTMLDivElement | null>(null);
let lf: LogicFlow;

// 当前右键点击的节点
const contextNode = ref<any>(null);

// 右键菜单显示控制
const contextMenuVisible = ref(false);
const contextMenuPosition = reactive({ x: 0, y: 0 });

onMounted(() => {
    lf = new LogicFlow({
        container: containerRef.value!,
        grid: true,
        // 隐藏节点的连接点
        hideAnchors: true
    });

    // 注册自定义节点
    lf.register({ type: 'start-node', model: StartNodeModel, view: StartNode });
    lf.register({ type: 'condition-node', model: ConditionNodeModel, view: ConditionNode });
    lf.register({ type: 'condition-true-node', model: ConditionTrueNodeModel, view: ConditionTrueNode });
    lf.register({ type: 'condition-false-node', model: ConditionFalseNodeModel, view: ConditionFalseNode });
    lf.register({ type: 'end-node', model: EndNodeModel, view: EndNode });

    lf.render({ nodes: [], edges: [] });

    // 自动添加一个开始节点
    addNode('start-node');

    // 监听右键点击节点
    lf.on('node:contextmenu', ({ data, e }) => {
        e.preventDefault();
        contextNode.value = data;
        contextMenuVisible.value = true;
        contextMenuPosition.x = e.clientX;
        contextMenuPosition.y = e.clientY;
    });

    // 点击空白处隐藏菜单
    lf.on('blank:click', () => contextMenuVisible.value = false);

    // 移除空白处右键弹出菜单的功能
    // lf.on('blank:contextmenu', ({ e }) => {
    //     e.preventDefault();
    //     contextMenuVisible.value = true;
    //     contextMenuPosition.x = e.clientX;
    //     contextMenuPosition.y = e.clientY;
    // });
});

// 添加节点
const addNode = (nodeType: string) => {
    if (!nodeType) {
        message.warning('添加节点失败')
        return
    }

    // 如果当前节点是结束节点，则不允许添加子节点
    if (contextNode.value && contextNode.value.type === 'end-node') {
        message.warning('结束节点不能添加子节点');
        contextMenuVisible.value = false;
        return;
    }

    // 生成唯一ID
    const newId = uuidv4();

    // 创建节点对象
    const node = {
        id: newId,
        type: nodeType,
        x: contextNode.value ? contextNode.value.x : 100,
        y: contextNode.value ? contextNode.value.y + 150 : 100, // 在父节点下方150像素
        text: '', // 默认由节点模型赋值
        width: 100,
        height: 40,
        ports: []
    };

    // 添加节点
    lf.addNode(node);

    // 如果有父节点，则添加连接线
    if (contextNode.value) {
        lf.addEdge({
            sourceNodeId: contextNode.value.id,
            targetNodeId: newId,
            type: 'polyline'
        });
    }

    // 隐藏右键菜单
    contextMenuVisible.value = false;
};

// 添加子节点
const addChildNode = (nodeType: string = 'condition-node') => {
    if (!contextNode.value) return;

    // 如果当前节点是结束节点，则不允许添加子节点
    if (contextNode.value.type === 'end-node') {
        message.warning('结束节点不能添加子节点');
        contextMenuVisible.value = false;
        return;
    }

    const parent = contextNode.value;
    const newId = uuidv4();
    const childNode = {
        id: newId,
        type: nodeType,
        x: parent.x,
        y: parent.y + 150, // 在父节点下方150像素
        text: '',
        width: 100,
        height: 40,
        ports: [],
    };

    lf.addNode(childNode);
    lf.addEdge({
        sourceNodeId: parent.id,
        targetNodeId: newId,
        type: 'polyline'
    });

    contextMenuVisible.value = false;
};

// 删除节点
const deleteNode = () => {
    if (!contextNode.value) return;

    // 获取要删除的节点类型
    const nodeType = contextNode.value.type;

    // 如果是起始节点，则不允许删除
    if (nodeType === 'start-node') {
        // 可以使用之前导入的message工具提示用户
        message.warning('起始节点不能删除');
        contextMenuVisible.value = false;
        return;
    }

    // 获取要删除的节点ID
    const nodeId = contextNode.value.id;

    // 删除节点
    lf.deleteNode(nodeId);

    // 隐藏右键菜单
    contextMenuVisible.value = false;
};
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
