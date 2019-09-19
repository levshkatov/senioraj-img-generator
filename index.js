module.exports = {
  newRequest: newRequest,
}

const mysqlObj = require("mysql");
const express = require("express");
const http = require("http");
const consoleStamp = require("console-stamp");
const util = require("util");
const colors = require("colors/safe");
const { imgGenerate } = require("./img-generator");

const PORT = 8444;

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
// const mysqlConnect = util.promisify(mysql.connect).bind(mysql);


const app = express();
const httpServer = http.createServer(app);
const api = require("./api");
app.use('/', api);


log("***   Image Generator started   ***");

httpServer.listen(PORT, () => {
  log(`Express is listening on ${PORT}`);
});


async function newRequest(res, type) {

  const typesObj = {
    "skrill_dollar_gaming": {
      tableName: "Skrill $ (Игровой)",
      currency: "$",
      folderName: "skrill_dollar_gaming",
    },
    "skrill_euro_gaming": {
      tableName: "Skrill € (Игровой)",
      currency: "€",
      folderName: "skrill_euro_gaming",
    },
    "neteller_dollar_gaming": {
      tableName: "Neteller $ (Игровой)",
      currency: "$",
      folderName: "neteller_dollar_gaming",
    },
    "neteller_euro_gaming": {
      tableName: "Neteller € (Игровой)",
      currency: "€",
      folderName: "neteller_euro_gaming",
    },
    "skrill_dollar_common": {
      tableName: "Skrill $ (Обычный)",
      currency: "$",
      folderName: "skrill_dollar_common",
    },
    "skrill_euro_common": {
      tableName: "Skrill €(Обычный)",
      currency: "€",
      folderName: "skrill_euro_common",
    },
    "neteller_dollar_common": {
      tableName: "Neteller $ (Обычный)",
      currency: "$",
      folderName: "neteller_dollar_common",
    },
    "neteller_euro_common": {
      tableName: "Neteller € (Обычный)",
      currency: "€",
      folderName: "neteller_euro_common",
    },
  }

  try {
    const orders = await getOrders(type);

    const image = await imgGenerate(orders, {
      tableName: typesObj[type].tableName,
      currency: typesObj[type].currency,
      adsFolderName: typesObj[type].folderName,
    });

    const fileName = `${Date.now()}.png`;
    await writeFile(`./images/${fileName}`, image);
    console.log(`${fileName} written`);

    return res.sendFile(`./images/${fileName}`, {
      root: __dirname,
    }, (err) => {
      if (err) {
        error(err);
        return res.status(404).send(`Error on server`);
      }
      log("File sent");
    });

  } catch (err) {
    error(err);
    return res.status(404).send(`Error on server`);
  }
}



async function getOrders(type) {

  const filters = {
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

  const orders = {};

  const sql = `SELECT id, min_amount as min, count as max, unit_price as price FROM orders WHERE payment = ? AND valute = ? AND type = ? AND disabled = 0 ORDER BY unit_price`;

  const orderPromises = []; 

  orders.buy = await mysqlQuery(`${sql} DESC`, [
    filters[type].payment,
    filters[type].valute,
    1
  ]);
  orderPromises.push(orders.buy);

  orders.sell = await mysqlQuery(`${sql} ASC`, [
    filters[type].payment,
    filters[type].valute,
    2,
  ]);
  orderPromises.push(orders.sell);

  return Promise.all(orderPromises).then(() => {
    return orders;
  });
}

