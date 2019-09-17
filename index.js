const mysqlObj = require("mysql");
const express = require("express");
const consoleStamp = require("console-stamp");
const util = require("util");
const colors = require('colors/safe');

consoleStamp(console, {
  pattern: 'HH:MM:ss.l',
  metadata: () => `| ${Math.round(process.memoryUsage().rss / 1000000)}Mb |`,
  datePrefix: '',
  dateSuffix: ' |',
  labelPrefix: '',
  labelSuffix: '',
  colors: {
      stamp: ['green', 'dim'],
      label: ['blue', 'bold'],
      metadata: ['yellow'],
  },
});
const log = console.log;
const error = console.error;

const mysql = mysqlObj.createConnection({
  host: "localhost",
  user: "root",
  password: "abcde4815162342",
  database: "exchange",
});

const mysqlQuery = util.promisify(mysql.query).bind(mysql);
const mysqlConnect = util.promisify(mysql.connect).bind(mysql);


(async () => {

  log("***   Image Generator started   ***");

  try {
    await mysqlConnect();
    log(`Connected to database "exchange"`);

    await core();

  } catch(err) {
    console.error(colors.red(err));
  } finally {
    mysql.end();
    log(colors.yellow("***   Image Generator closed   ***"));
  }
})();


async function core() {

  const filters = {
    "buy": {
      type: 1,
      order: "DESC",
    },
    "sell": {
      type: 2,
      order: "ASC",
    },
    "skrill_dollar_gaming": {
      payment: 3,
      valute: 1,
    },
    "skrill_euro_gaming": {
      payment: 3,
      valute: 2,
    },
    "neteller_dollar_gaming": {
      payment: 4,
      valute: 1,
    },
    "neteller_euro_gaming": {
      payment: 4,
      valute: 2,
    },
    "skrill_dollar_common": {
      payment: 2,
      valute: 1,
    },
    "skrill_euro_common": {
      payment: 2,
      valute: 2,
    },
    "neteller_dollar_common": {
      payment: 1,
      valute: 1,
    },
    "neteller_euro_common": {
      payment: 1,
      valute: 2,
    },
  };

  const orders = {
    "skrill_dollar_gaming": {},
    "skrill_euro_gaming": {},
    "neteller_dollar_gaming": {},
    "neteller_euro_gaming": {},
    "skrill_dollar_common": {},
    "skrill_euro_common": {},
    "neteller_dollar_common": {},
    "neteller_euro_common": {},
  };

  const sql = `SELECT id, min_amount as min, count as max, unit_price as price FROM orders WHERE payment = ? AND valute = ? AND type = ? AND disabled = 0 ORDER BY unit_price ?`;

  const orderPromises = []; 

  for (const orderName of Object.getOwnPropertyNames(orders)) {
    orders[orderName].buy = await mysqlQuery(sql, [
      filters[orderName].payment,
      filters[orderName].valute,
      filters.buy.type,
      filters.buy.order,
    ]);
    orderPromises.push(orders[orderName].buy);

    orders[orderName].sell = await mysqlQuery(sql, [
      filters[orderName].payment,
      filters[orderName].valute,
      filters.sell.type,
      filters.sell.order,
    ]);
    orderPromises.push(orders[orderName].sell);
  }

  Promise.all(orderPromises).then(() => {
    log(JSON.stringify(orders, null, 2));
  });
}

