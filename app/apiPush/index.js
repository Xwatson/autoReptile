const wordpress = require("./wp");

module.exports = async (action = "", data) => {
  const actions = action.split("-"),
    type = actions[0];
  switch (type) {
    case "wordpress":
      return await wordpress[actions[1]](data);
    default:
      return {
        action,
        data,
        message: "未找到推送的action",
      };
  }
};
