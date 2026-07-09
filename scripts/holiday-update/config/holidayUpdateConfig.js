"use strict";

const path = require("node:path");

const HOLIDAY_UPDATE_CONFIG = {
  csvUrl: "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv",
  outputPath: path.join(__dirname, "..", "..", "..", "data", "syukujitsu.csv"),
  timeZone: "Asia/Tokyo"
};

module.exports = { HOLIDAY_UPDATE_CONFIG };
