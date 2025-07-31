import puppeteer from 'puppeteer-core'
import fs from 'fs'
;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // headless: 'shell',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--start-maximized'],
    defaultViewport: null
  })

  const page = await browser.newPage()

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  )

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    })
  })

  await page.goto('about:blank')

  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'))
  await page.setCookie(...cookies)

  const storage = JSON.parse(fs.readFileSync('storage.json', 'utf-8'))
  await page.evaluateOnNewDocument((storage) => {
    for (const [key, value] of Object.entries(storage.localStorage)) {
      localStorage.setItem(key, value)
    }
    for (const [key, value] of Object.entries(storage.sessionStorage)) {
      sessionStorage.setItem(key, value)
    }
  }, storage)

  // 进入 QQ 邮箱主页
  await page.goto('https://wx.mail.qq.com', { waitUntil: 'networkidle2' })

  const emailContents = []

  // 截图初始界面
  await page.screenshot({ path: 'screenshot-initial.png', fullPage: true })

  // 再截图一次
  await page.screenshot({ path: 'screenshot-after-scroll.png', fullPage: true })

  // 可选：继续多滚几次，确保加载足够邮件

  for (let i = 0; i < 10; i++) {
    try {
      // 等待邮件列表项加载
      await page.waitForSelector('.mail-list-page-item', { timeout: 10000 })
      await page.waitForFunction(
        () => document.querySelectorAll('.mail-list-page-item').length > 0,
        { timeout: 15000 }
      )

      const items = await page.$$('.mail-list-page-item')
      if (i >= items.length) break

      // 点击第 i 封邮件
      await items[i].click()

      // 等待邮件详情加载
      await page.waitForSelector('.mail-detail-content', { timeout: 10000 })
      const content = await page.$eval('.mail-detail-content', (el) => {
        return el.innerText
          .split('\n') // 按行分割
          .map((line) => line.trim()) // 去除每行前后空格
          .filter((line) => line.length > 0) // 移除空行
          .join('\n') // 重新拼接
      })

      emailContents.push({ index: i + 1, content })

      // 点击返回按钮
      await page.waitForSelector(
        '.xmail-ui-btn.ui-btn-size32.ui-btn-border.ui-btn-them-clear-gray',
        { timeout: 10000 }
      )
      await page.click('.xmail-ui-btn.ui-btn-size32.ui-btn-border.ui-btn-them-clear-gray')

      await page.waitForTimeout(1000)
    } catch (err) {
      console.error(`❌ 第 ${i + 1} 封邮件处理失败:`, err)
    }
  }

  console.log(emailContents)

  await browser.close()
})()
