const mongoose = require("mongoose");
require("dotenv").config();

const mongoDbUrl = process.env.MONGODB_URL;

let _db;

const initDb = (callback) => {
  if (_db) {
    return callback(null, _db);
  }
  mongoose
    .connect(mongoDbUrl)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};