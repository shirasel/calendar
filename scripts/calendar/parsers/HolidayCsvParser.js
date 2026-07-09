class HolidayCsvParser {
  parse(text) {
    const holidays = new Map();
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);

    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;

      const [dateText, name] = this.parseLine(line);
      const parts = dateText.split("/").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN) || !name) continue;

      holidays.set(window.DateUtils.dateKey(parts[0], parts[1], parts[2]), name.trim());
    }

    return holidays;
  }

  parseLine(line) {
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
}

window.HolidayCsvParser = HolidayCsvParser;
