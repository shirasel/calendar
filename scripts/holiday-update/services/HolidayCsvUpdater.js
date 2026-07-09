"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

class HolidayCsvUpdater {
  constructor(csvUrl, outputPath, timeZone) {
    this.csvUrl = csvUrl;
    this.outputPath = outputPath;
    this.timeZone = timeZone;
  }

  async update() {
    const bytes = await this.fetchCsv();
    await this.saveCsv(bytes);
    this.logUpdated(bytes.length);
  }

  async fetchCsv() {
    const response = await fetch(this.csvUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`CSV fetch failed: ${response.status} ${response.statusText}`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0) {
      throw new Error("CSV fetch failed: empty response");
    }

    return bytes;
  }

  async saveCsv(bytes) {
    await fs.mkdir(path.dirname(this.outputPath), { recursive: true });
    await fs.writeFile(this.outputPath, bytes);
  }

  logUpdated(byteLength) {
    const updatedAt = new Date().toLocaleString("ja-JP", { timeZone: this.timeZone });
    console.log(`${updatedAt} updated ${this.outputPath} (${byteLength} bytes)`);
  }
}

module.exports = { HolidayCsvUpdater };
