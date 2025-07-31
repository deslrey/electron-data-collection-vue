<template>
    <div>
        <button @click="runCrawl" class="run-crawl-button">点我执行脚本文件</button>
        <Test />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Test from './views/Test.vue';

const results = ref([]); // 结构化数据集合

const runCrawl = async () => {
    const res = await window.electronAPI.runUserCrawl();
    console.log('👀 调用了 runUserCrawl')
    if (res.success) {
        // 假设每次抓取返回的是一个数组
        // results.value.push(...res.data); // 合并到总集合
        // 或者 results.value.push(res.data); // 如果你想分批保存
    } else {
        // 也可以用一个专门的 error 集合保存错误
        console.log('出错了: ' + res.error);
    }
};
</script>

<style scoped>
.run-crawl-button {
    display: flex;
    justify-self: center;
}
</style>