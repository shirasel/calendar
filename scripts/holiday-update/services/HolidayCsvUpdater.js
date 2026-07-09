"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

class HolidayCsvUpdater {
  constructor(csvUrl, outputPath, dataScriptPath, dataGlobalName, timeZone) {
    this.csvUrl = csvUrl;
    this.outputPath = outputPath;
    this.dataScriptPath = dataScriptPath;
    this.dataGlobalName = dataGlobalName;
    this.timeZone = timeZone;
  }

  async update() {
    const bytes = await this.fetchCsv();
    await this.saveCsv(bytes);
    await this.saveDataScript(bytes);
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

  async saveDataScript(bytes) {
    const text = new TextDecoder("shift_jis").decode(bytes);
    const entries = this.parseCsv(text);
    const script = `"use strict";\nwindow.${this.dataGlobalName} = ${JSON.stringify(entries, null, 2)};\n`;

    await fs.mkdir(path.dirname(this.dataScriptPath), { recursive: true });
    await fs.writeFile(this.dataScriptPath, script, "utf8");
  }

  parseCsv(text) {
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
    const entries = [];

    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;

      const [dateText, name] = this.parseCsvLine(line);
      const parts = dateText.split("/").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN) || !name) continue;

      entries.push([this.dateKey(parts[0], parts[1], parts[2]), name.trim()]);
    }

    return entries;
  }

  parseCsvLine(line) {
    const values = [];
    let current = "";
    let quoted = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];

      if (char === "\"" && quoted && next === "\"") {
        current += "\"";
        index += 1;
      } else if (char === "\"") {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current);
    return values;
  }

  dateKey(year, month, day) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  logUpdated(byteLength) {
    const updatedAt = new Date().toLocaleString("ja-JP", { timeZone: this.timeZone });
    console.log(`${updatedAt} updated ${this.outputPath} (${byteLength} bytes)`);
  }
}

module.exports = { HolidayCsvUpdater };
