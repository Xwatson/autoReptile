const Service = require("egg").Service;
const ApiClient = require("../../tbkSDK").ApiClient;
const { tbk } = require("../../config/key.config");

class TBKService extends Service {
  async executeWithHeader(method, data) {
    return new Promise((resolve, reject) => {
      const client = new ApiClient(tbk.apiClient);

      client.executeWithHeader(method, data, {}, function (error, response) {
        if (!error) resolve(response);
        else reject(error);
      });
    });
  }
}

module.exports = TBKService;
