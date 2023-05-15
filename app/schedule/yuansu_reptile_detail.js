const fs = require("fs");
const path = require("path");
const Subscription = require("egg").Subscription;

class ReptileDetail extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: "1m", // 1 分钟间隔
      disable: true,
      type: "all", // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const code = fs.readFileSync(
      path.join(__dirname, "../jsEval/yuansu/detail.js"),
      "utf-8"
    );
    const data = await this.ctx.service.reptile.detail(
      "https://www.ysu2.com/90884.html",
      code,
      "xwatson"
    );
    this.app.getLogger("yuansuLogger").info("抓取数据: ", JSON.stringify(data));
  }
}

module.exports = ReptileDetail;
