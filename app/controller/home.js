const Controller = require("egg").Controller;
const DB = require("../db");
const reptile = require("../reptile");

class HomeController extends Controller {
  async index() {
    await this.ctx.render("home.tpl", {
      list: [{ msg: "666" }],
    });
  }

  async list() {
    const data = await this.ctx.service.reptile();
    await this.ctx.render("home.tpl", {
      list: data,
    });
  }

  async detail() {
    const { ctx } = this;
    const { url, detail_js_eval } = ctx.request.body;
    if (url && detail_js_eval) {
      const data = await this.ctx.service.reptile(url, detail_js_eval);
      ctx.body = {
        code: 0,
        message: "success",
        data,
      };
    }
    ctx.body = {
      code: 1,
      message: "参数错误",
    };
  }
}

module.exports = HomeController;
