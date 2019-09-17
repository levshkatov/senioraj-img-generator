const mysqlObj = require("mysql");
const express = require("express");
const consoleStamp = require("console-stamp");

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

const start = () => {
  log("***   Image Generator started   ***");

  mysql.connect(err => {
    if (err) {
      return error(`MySQL connect: ${err.message}`);
    }
    
    log(`Connected to database "exchange"`);
  });
}

start();