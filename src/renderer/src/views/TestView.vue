<template>
  <div>
    <div style="margin-bottom: 10px">
      <input v-model="url" style="width: 300px" />
      <button @click="loadUrl">加载页面</button>
      <button @click="startElementPicker" :disabled="!webviewReady">开启XPath获取模式</button>
      <button @click="saveLoginSession" :disabled="!webviewReady">保存登录状态</button>
    </div>
    <webview
      v-if="currentUrl"
      ref="webviewRef"
      :src="currentUrl"
      style="width: 100%; height: 800px; border: 1px solid #ccc"
      @did-finish-load="onWebviewLoad"
    />
    <div v-if="selectedInfo" style="margin-top: 10px; border: 1px solid #eee; padding: 10px">
      <div><b>tag:</b> {{ selectedInfo.tag }}</div>
      <div><b>id:</b> {{ selectedInfo.id }}</div>
      <div><b>class:</b> {{ selectedInfo.class }}</div>
      <div>
        <b>xpath:</b> <span style="color: blue">{{ selectedInfo.xpath }}</span>
      </div>
      <div><b>内容:</b> {{ selectedInfo.text }}</div>
      <div v-if="selectedInfo.href">
        <b>链接:</b>
        <a :href="selectedInfo.href" target="_blank">{{ selectedInfo.href }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { pickerCode } from '@renderer/utils/PickerCode'
import { ref, watch } from 'vue'

const url = ref('http://www.baidu.com/')
// const url = ref('https://wx.mail.qq.com');
const currentUrl = ref('')
const webviewRef = ref(null)
const selectedInfo = ref(null)
const webviewReady = ref(false)

function loadUrl() {
  let val = url.value.trim()
  if (!/^https?:\/\//i.test(val)) {
    val = 'https://' + val
  }
  currentUrl.value = val
  selectedInfo.value = null
  webviewReady.value = false
  console.log('加载完成')
}

function onWebviewLoad() {
  webviewReady.value = true
}

async function saveLoginSession() {
  if (!webviewRef.value || !currentUrl.value) {
    alert('WebView 未准备好或 URL 为空')
    return
  }

  // 提取 localStorage & sessionStorage
  const rawStorage = await webviewRef.value.executeJavaScript(`
    JSON.stringify({
      localStorage: Object.fromEntries(Object.entries(localStorage)),
      sessionStorage: Object.fromEntries(Object.entries(sessionStorage))
    });
  `)

  const storage = JSON.parse(rawStorage)

  // 通过 preload.js 暴露的 saveSessionData 发给主进程
  try {
    const result = await window.electronAPI.saveSessionData(currentUrl.value, storage)
    if (result.success) {
      alert('✅ 登录状态保存成功')
    } else {
      alert('❌ 保存失败')
    }
  } catch (err) {
    console.error('IPC 错误', err)
    alert('❌ 保存失败，见控制台错误')
  }
}

// 注入脚本到 webview，获取元素信息
function startElementPicker() {
  const jsCode = pickerCode()
  webviewRef.value.executeJavaScript(jsCode)
}

// 关键：watch webviewRef，webview 渲染后再绑定事件
watch(webviewRef, (el) => {
  if (el) {
    el.addEventListener('console-message', (e) => {
      if (e.message.startsWith('__ELEMENT_INFO__')) {
        const json = e.message.replace('__ELEMENT_INFO__', '')
        try {
          selectedInfo.value = JSON.parse(json)
        } catch (err) {
          console.error('解析失败:', err)
        }
      }
    })
  }
})
</script>

<style scoped lang="less">
.full-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.full-webview {
  transform: scale(0.8);
  transform-origin: top left;
  width: 125%;
  height: 125%;
  border: none;
}

.inspect-btn {
  position: absolute;
  z-index: 9999;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.info-box {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  z-index: 9999;
  width: 300px;
}
</style>
