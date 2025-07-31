import puppeteer from 'puppeteer-core'
import fs from 'fs'
;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: null
  })

  const page = await browser.newPage()

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })

  // 等待 XPath 元素出现
  await page.waitForFunction(() => {
    const result = document.evaluate(
      '//*[@id="app"]/div/input',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    return result.singleNodeValue !== null
  })

  // 使用 evaluate 执行 XPath 并输入
  await page.evaluate(() => {
    const result = document.evaluate(
      '//*[@id="app"]/div/input',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    const input = result.singleNodeValue
    if (input) {
      input.focus()
      input.value = 'j'

      // 触发 input 事件（模拟输入）
      const event = new Event('input', { bubbles: true })
      input.dispatchEvent(event)
    }
  })

  // 等待搜索结果
  await page.waitForSelector('.item-card')

  // 提取信息
  const users = await page.$$eval('.item-card', (cards) =>
    cards.map((card) => {
      const getText = (selector) =>
        card.querySelector(selector)?.innerText.trim().replace(/^.*：/, '') || ''

      return {
        avatar: card.querySelector('img.avatar')?.src || '',
        name: getText('p:nth-child(1)'),
        gender: getText('p:nth-child(2)'),
        age: getText('p:nth-child(3)'),
        address: getText('p:nth-child(4)'),
        email: getText('p:nth-child(5)'),
        phone: getText('p:nth-child(6)')
      }
    })
  )

  fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf-8')

  console.log('搜索结果:', users)

  await browser.close()
})()
