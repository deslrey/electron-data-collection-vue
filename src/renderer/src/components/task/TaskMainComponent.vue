<template>
  <div class="container">
    <div class="taskmain-layout">
      <webview
        ref="webviewRef"
        :src="currentLink"
        @did-finish-load="onDidFinishLoad"
        style="height: 100%; width: 100%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { pickerCode } from '@renderer/utils/PickerCode'
import { ref, watch } from 'vue'

const webviewRef = ref(null)
const selectedInfo = ref(null)
const webviewReady = ref<boolean>(false)
const currentLink = ref<string>('https://baidu.com')

const loadUrl = (): void => {
  webviewReady.value = false
  console.log('加载完成')
}

const onDidFinishLoad = (): void => {
  webviewReady.value = true
}

const startElementPicker = (): void => {
  const jsCode = pickerCode()
  webviewRef.value.executeJavaScript(jsCode)
}

watch(webviewRef, (el: any) => {
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
console.log(currentLink.value)
</script>
<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
}

.taskmain-layout {
  height: 100%;
}
</style>
