const mysql = require("mysql");
const dbConfig = require("../../config/db.json");

class DB {
  constructor() {
    // 创建连接池
    this.pool = mysql.createPool(dbConfig);
  }

  // 查询方法
  query(sql, params) {
    return new Promise((resolve, reject) => {
      // 获取连接
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          // 执行查询
          connection.query(sql, params, (err, results) => {
            // 释放连接
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        }
      });
    });
  }
}

module.exports = DB;
