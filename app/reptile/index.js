const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const { sleep, getRandom } = require("../utils");
const { waitTillHTMLRendered } = require("../utils/puppeteer");

puppeteer.use(StealthPlugin());

let loginCount = 0;
async function clickNewPage(browser, page, clickSelector) {
  console.log("正在执行点击打开新页面任务：", clickSelector);
  const btn = await page.waitForSelector(clickSelector);
  const newPagePromise = new Promise((res) =>
    browser.once("targetcreated", (target) => res(target.page()))
  );
  await btn.click();
  const newPage = await newPagePromise;
  console.log("已点击", clickSelector);
  console.log("页面标题：",await newPage.title());
  await sleep(1000);
  await waitTillHTMLRendered(newPage);
  return newPage;
}
async function evaluateNewPage(browser, page, code, noClosePage) {
  console.log(
    "开始执行代码",
    `${code.substring(0, 30)}${code.length > 30 ? "..." : ""}`
  );
  let res = await page.evaluate((code) => {
    return eval(code);
  }, code);
  console.log("代码执行结束，action:", res.action);
  console.log("错误消息:", res.errMsg);
  let newPage = page;
  switch (res.action) {
    case "new_download_page":
      console.log("开始执行new_download_page");
      newPage = await clickNewPage(browser, page, res.clickSelector);
      console.log("点击打开新页面加载完成");
      break;
    case "get_new_page_url":
      console.log("开始执行get_new_page_url");
      newPage = await clickNewPage(browser, page, res.clickSelector);
      await sleep(4000);
      res.sourceUrl = await newPage.url();
      console.log("获取页面url完成：", res.sourceUrl);
      break;
    case "login":
      console.log("开始执行login");
      newPage = page;
      loginCount++;
      res.loginCount = loginCount;
      if (loginCount > 3) {
        console.log("登录次数超过3次");
        return res;
      }
      if (res.loginType === "current") {
        await evaluateNewPage(browser, newPage, res.code, true);
      } else {
        const loginPage = await browser.newPage();
        await loginPage.goto(res.loginUrl, {
          waitUntil: "networkidle0",
          timeout: 60000,
        });
        await loginPage.waitForSelector("body");
        await evaluateNewPage(browser, loginPage, res.code);
      }
      res.code = code;
      await sleep(3530);
      await newPage.reload();
      await waitTillHTMLRendered(newPage);
      break;
    default:
      break;
  }
  if (res.code) {
    const newRes = await evaluateNewPage(browser, newPage, res.code);
    res = { ...res, ...newRes };
  }
  if (!noClosePage) {
    try {
      newPage.close();
    } catch (error) {}
  }
  return res;
}

async function evaluateDetailPage(browser, page, task) {
  const res = await evaluateNewPage(browser, page, task.detail_js_eval);
  res.code = "";
  try {
    //切换回原始页面
    await page.bringToFront();
  } catch (error) {}
  return res;
}

module.exports = async (task) => {
  if (!task) {
    return null;
  }
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ...(task.user_name
      ? { userDataDir: path.join(__dirname, `../../userData/${task.user_name}`) }
      : null),
  });
  let page = await browser.newPage();

  console.log("正在打开地址：", task.url);
  await page.goto(task.url, { waitUntil: "networkidle0", timeout: 60000 });
  console.log("已加载");
  let res = {};
  if (task.list_url_eval) {
    console.log("执行列表任务");
    const urls = await page.evaluate((task) => {
      return eval(`${task.list_url_eval}`);
    }, task);
    console.log("获取到url：", urls);
    page.close();
    while (urls && urls.length > 0) {
      page = await browser.newPage();
      const url = urls.shift();
      console.log("正在抓取：", url);
      await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
      res = await evaluateDetailPage(browser, page, task);
      await sleep(getRandom(700, 3200));
    }
  } else if (task.detail_js_eval) {
    console.log("执行详情任务");
    res = await evaluateDetailPage(browser, page, task);
  }

  await browser.close();
  return res;
};
