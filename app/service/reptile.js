const Service = require("egg").Service;
const reptile = require("../reptile/index");

class ReptileService extends Service {
  async list() {
    const db = new DB();
    const tasks = await db.query(
      "select * from reptile_task where is_enable = 1"
    );
    const data = [];
    for (const task of tasks) {
      const res = await reptile(task);
      data.push(res);
    }
    return data;
  }

  async detail(url, detail_js_eval, user_name) {
    return await reptile({
      url,
      detail_js_eval,
      user_name,
    });
  }
}

module.exports = ReptileService;
