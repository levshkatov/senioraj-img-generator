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
const mysqlConnect = util.promisify(mysql.connect).bind(mysql);


const app = express();
const httpServer = http.createServer(app);
const api = require("./api");
app.use('/', api);

(async () => {

  log("***   Image Generator started   ***");

  httpServer.listen(PORT, () => {
    log(`Express is listening on ${PORT}`);
  });

  try {
    await mysqlConnect();
    log(`Connected to database "exchange"`);
    const orders = {
      "skrill_dollar_gaming": {
        "buy": [
          {
            "id": 1716,
            "min": 500,
            "max": 500,
            "price": 63
          }
        ],
        "sell": [
          {
            "id": 1742,
            "min": 200,
            "max": 260,
            "price": 63.83
          },
          {
            "id": 1761,
            "min": 123,
            "max": 123,
            "price": 64
          },
          {
            "id": 1746,
            "min": 50,
            "max": 300,
            "price": 65
          },
          {
            "id": 1640,
            "min": 100,
            "max": 100,
            "price": 65.5
          },
          {
            "id": 1748,
            "min": 50,
            "max": 500,
            "price": 65.78
          },
          {
            "id": 1464,
            "min": 300,
            "max": 500,
            "price": 66
          },
          {
            "id": 1562,
            "min": 150,
            "max": 150,
            "price": 66
          },
          {
            "id": 1267,
            "min": 50,
            "max": 500,
            "price": 71
          },
          {
            "id": 1374,
            "min": 50,
            "max": 500,
            "price": 72
          },
          {
            "id": 1378,
            "min": 50,
            "max": 500,
            "price": 72
          },
          {
            "id": 1405,
            "min": 50,
            "max": 400,
            "price": 72
          },
          {
            "id": 1413,
            "min": 50,
            "max": 500,
            "price": 72
          }
        ]
      },
      "skrill_euro_gaming": {
        "buy": [],
        "sell": [
          {
            "id": 1591,
            "min": 100,
            "max": 900,
            "price": 70
          },
          {
            "id": 1695,
            "min": 100,
            "max": 400,
            "price": 70
          },
          {
            "id": 1472,
            "min": 100,
            "max": 100,
            "price": 72
          }
        ]
      },
      "neteller_dollar_gaming": {
        "buy": [
          {
            "id": 1563,
            "min": 200,
            "max": 200,
            "price": 66.5
          },
          {
            "id": 1763,
            "min": 120,
            "max": 150,
            "price": 65.5
          },
          {
            "id": 1762,
            "min": 100,
            "max": 150,
            "price": 65
          },
          {
            "id": 1702,
            "min": 250,
            "max": 300,
            "price": 64.7
          },
          {
            "id": 1732,
            "min": 200,
            "max": 300,
            "price": 64.6
          },
          {
            "id": 1743,
            "min": 200,
            "max": 300,
            "price": 64.5
          },
          {
            "id": 1757,
            "min": 150,
            "max": 300,
            "price": 64.5
          },
          {
            "id": 1750,
            "min": 150,
            "max": 300,
            "price": 64.4
          },
          {
            "id": 1714,
            "min": 50,
            "max": 50,
            "price": 64
          },
          {
            "id": 1681,
            "min": 300,
            "max": 500,
            "price": 63.5
          },
          {
            "id": 1740,
            "min": 50,
            "max": 200,
            "price": 61
          }
        ],
        "sell": []
      },
      "neteller_euro_gaming": {
        "buy": [
          {
            "id": 1704,
            "min": 500,
            "max": 500,
            "price": 70.5
          },
          {
            "id": 1749,
            "min": 500,
            "max": 500,
            "price": 69.7
          }
        ],
        "sell": [
          {
            "id": 1709,
            "min": 333,
            "max": 333,
            "price": 71.53
          },
          {
            "id": 1719,
            "min": 187,
            "max": 187,
            "price": 72
          },
          {
            "id": 1634,
            "min": 400,
            "max": 450,
            "price": 72.3
          },
          {
            "id": 1674,
            "min": 50,
            "max": 500,
            "price": 72.7
          },
          {
            "id": 1657,
            "min": 500,
            "max": 2000,
            "price": 73.7
          },
          {
            "id": 1607,
            "min": 20,
            "max": 1000,
            "price": 74
          },
          {
            "id": 1611,
            "min": 150,
            "max": 400,
            "price": 74.5
          },
          {
            "id": 1445,
            "min": 10,
            "max": 166,
            "price": 75.5
          }
        ]
      },
      "skrill_dollar_common": {
        "buy": [],
        "sell": []
      },
      "skrill_euro_common": {
        "buy": [],
        "sell": [
          {
            "id": 1493,
            "min": 50,
            "max": 800,
            "price": 71
          },
          {
            "id": 1242,
            "min": 53,
            "max": 53,
            "price": 72
          }
        ]
      },
      "neteller_dollar_common": {
        "buy": [
          {
            "id": 1205,
            "min": 500,
            "max": 1000,
            "price": 65.6
          }
        ],
        "sell": []
      },
      "neteller_euro_common": {
        "buy": [
          {
            "id": 1204,
            "min": 20,
            "max": 20,
            "price": 73
          },
          {
            "id": 1712,
            "min": 300,
            "max": 500,
            "price": 72.3
          }
        ],
        "sell": [
          {
            "id": 1632,
            "min": 100,
            "max": 500,
            "price": 72.3
          }
        ]
      }
    }
  } catch(err) {
    console.error(colors.red(err));
  } finally {
    mysql.end();
    log(colors.yellow("***   Image Generator closed   ***"));
  }
})();


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

  const orders = await getOrders(type);

  const image = await imgGenerate(orders, {
    tableName: typesObj.type.tableName,
    currency: typesObj.type.currency,
    adsFolderName: typesObj.type.folderName,
  });

  const fileName = `${Date.now()}.png`;
  await writeFile(`./images/${fileName}`, image);
  console.log(`${fileName} written`);

  return res.sendFile(`./images/${fileName}`, {
    root: __dirname,
  }, (err) => {
    if (err) {
      return error(err);
    }
    log("File sent");
  });
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

