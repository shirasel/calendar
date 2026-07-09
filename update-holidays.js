"use strict";

const { HolidayUpdateApplication } = require("./scripts/holiday-update/applications/HolidayUpdateApplication");

const application = new HolidayUpdateApplication(process.argv);

application.run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
