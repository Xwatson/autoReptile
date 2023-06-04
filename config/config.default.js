const path = require("path");

module.exports = (appInfo) => {
  return {
    keys: "AUTO_REPTILE",
    view: {
      defaultViewEngine: "nunjucks",
      mapping: {
        ".tpl": "nunjucks",
      },
    },
    customLogger: {
      yuansuLogger: {
        file: path.join(appInfo.root, "logs/yuansu/yuansu.log"),
      },
    },
    security: {
      csrf: {
        ignoreJSON: true
      },
    }
  };
};