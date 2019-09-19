const core = require("./index");
const express = require("express");
const router = express.Router();

const types = {
  "skrill-dollar-gaming": "skrill_dollar_gaming",
  "skrill-euro-gaming": "skrill_euro_gaming",
  "neteller-dollar-gaming": "neteller_dollar_gaming",
  "neteller-euro-gaming": "neteller_euro_gaming",
  "skrill-dollar-common": "skrill_dollar_common",
  "skrill-euro-common": "skrill_euro_common",
  "neteller-dollar-common": "neteller_dollar_common",
  "neteller-euro-common": "neteller_euro_common",
};

for (const type of Object.getOwnPropertyNames(types)) {
  router.get(`/${type}`, (req, res) => {
    console.log(`Request: ${type}`);
    return core.newRequest(res, types[type]);
  });
}

module.exports = router;
