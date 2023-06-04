const Controller = require("egg").Controller;

class WXController extends Controller {
  async receiveMsg() {
    const { ctx } = this;
    const { action, ...rest } = ctx.request.body;
    console.log("收到body:", ctx.request.body);
    switch (action) {
      case "tbk":
        const { method, ...tbjData } = rest;
        console.log("参数：", tbjData);
        const res = await this.ctx.service.tbk.executeWithHeader(
          method,
          tbjData
        );
        console.log("返回：", res);
        ctx.body = {
          code: 0,
          message: "",
          data: res,
        };
        return;

      default:
        break;
    }
    ctx.body = {
      code: 1,
      message: "参数错误",
    };
  }
}

module.exports = WXController;
