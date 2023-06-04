const WPAPI = require("wpapi");
const { wordpress } = require("../../config/key.config");
const wp = new WPAPI(wordpress.wpApi);

exports.postArticle = async function (data) {
  try {
    return await wp.posts().create(data);
  } catch (error) {
    return error;
  }
};
