import puppeteer from 'puppeteer-core'
import fs from 'fs'
;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: null
  })

  const page = await browser.newPage()
  const baseUrl = 'http://localhost:5173/1'

  await page.goto(baseUrl, { waitUntil: 'networkidle2' })

  // ✅ 直接设置输入并触发事件
  await page.waitForSelector('input.search-input')
  await page.evaluate(() => {
    const input = document.querySelector('input.search-input')
    if (input) {
      input.value = 'j'
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  })

  // ✅ 检查是否有结果
  const hasItems = await page
    .waitForSelector('.item-card', { timeout: 3000 })
    .then(() => true)
    .catch(() => false)

  if (!hasItems) {
    console.log('⚠️ 没有匹配的 item-card，直接退出')
    fs.writeFileSync('all-details.json', JSON.stringify([], null, 2), 'utf-8')
    await browser.close()
    return
  }

  const details = []

  // 获取 item 数量（不能提前取 href）
  const count = await page.$$eval('.item-card', (cards) => cards.length)

  for (let i = 0; i < count; i++) {
    const itemCards = await page.$$('.item-card')
    const card = itemCards[i]

    await card.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }))
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), card.click()])

    await page.waitForSelector('.item-detail')

    const detail = await page.$eval('.item-detail', (el) => {
      const getText = (label) => {
        const p = Array.from(el.querySelectorAll('p')).find((p) => p.innerText.includes(label))
        return p ? p.innerText.replace(`${label}：`, '').trim() : ''
      }

      return {
        name: el.querySelector('h2')?.innerText,
        gender: getText('性别'),
        age: getText('年龄'),
        address: getText('地址'),
        email: getText('邮箱'),
        phone: getText('手机号'),
        avatar: el.querySelector('img.avatar')?.src || ''
      }
    })

    details.push(detail)

    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.goBack()])

    // ✅ 再次设置输入并触发事件
    await page.waitForSelector('input.search-input')
    await page.evaluate(() => {
      const input = document.querySelector('input.search-input')
      if (input) {
        input.value = 'j'
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    await page.waitForSelector('.item-card')
  }

  fs.writeFileSync('all-details.json', JSON.stringify(details, null, 2), 'utf-8')
  console.log('✅ 所有数据采集完成，写入 all-details.json')

  await browser.close()
})()
