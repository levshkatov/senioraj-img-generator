const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const util = require('util');


const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.stat);


const WIDTH = 850;
const xOffset = 0;
const yOffset = 0;
const lineWidthBig = 3;
const lineWidthLittle = 1;
const tableWidth = WIDTH - yOffset*2;
const cellHeight = 24;
const cellWidth = tableWidth / 12;
const headerHeight = cellHeight * 5;

const GREEN = "#006400";
const RED = "#900000";

//params: {tableName, currency, adsFolderName}

const generate = async (orders, params) => {

  let fileName = "";
  const folderPath = `./advertisements/${params.adsFolderName}`;
  let file1 = false;
  let file2 = false;
  let file3 = false;
  let file4 = false;
  let file5 = false;

  try {
    fileName = "1-280х120.png";
    if (await exists(`${folderPath}/${fileName}`)) {
      file1 = true;
    }
  } catch(e){}
  try {
    fileName = "2-280х120.png";
    if (await exists(`${folderPath}/${fileName}`)) {
      file2 = true;
    }
  } catch(e){}
  try {
    fileName = "3-840х96.png";
    if (await exists(`${folderPath}/${fileName}`)) {
      file3 = true;
    }
  } catch(e){}
  try {
    fileName = "4-410х96.png";
    if (await exists(`${folderPath}/${fileName}`)) {
      file4 = true;
    }
  } catch(e){}
  try {
    fileName = "5-410х96.png";
    if (await exists(`${folderPath}/${fileName}`)) {
      file5 = true;
    }
  } catch(e){}



  const maxNumOfRows = (orders.buy.length >= orders.sell.length) 
  ? orders.buy.length 
  : orders.sell.length;

  const advBottom = (file4 || file5) ? 10 : 0;
  const advMiddle = (!advBottom && file3) ? 5 : 0;

  const totalHeight = headerHeight + cellHeight * (4 + maxNumOfRows + advBottom + advMiddle) + yOffset*2;

  let totalBuy = 0;
  orders.buy.forEach(order => totalBuy += order.max);

  let totalSell = 0;
  orders.sell.forEach(order => totalSell += order.max);
  
  const canvas = createCanvas(WIDTH, totalHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';



  //header
  ctx.lineWidth = lineWidthBig;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(xOffset, yOffset, tableWidth, headerHeight);
  ctx.lineWidth = lineWidthLittle;
  ctx.strokeRect(xOffset+cellWidth*4, yOffset, cellWidth*4, headerHeight);
  ctx.strokeRect(xOffset+cellWidth*4, yOffset+cellHeight*3, cellWidth*4, cellHeight*2);

  ctx.fillStyle = "black";
  ctx.font = 'bold 35px Arial';
  ctx.fillText('Книга заявок', xOffset+tableWidth/2, yOffset+cellHeight*1.5);
  ctx.font = '20px Arial';
  ctx.fillText(params.tableName, xOffset+tableWidth/2, yOffset+cellHeight*4);



  //1 row
  const row1YOffset = headerHeight+yOffset;

  ctx.lineWidth = lineWidthLittle;
  ctx.strokeRect(xOffset, row1YOffset, tableWidth, cellHeight*2);
  ctx.strokeRect(xOffset, row1YOffset, cellWidth*4, cellHeight*2);
  ctx.strokeRect(xOffset+cellWidth*4, row1YOffset, cellWidth*2, cellHeight*2);
  ctx.strokeRect(xOffset+cellWidth*6, row1YOffset, cellWidth*2, cellHeight*2);

  ctx.fillStyle = GREEN;
  ctx.font = 'bold 25px Arial';
  ctx.fillText('Всего на куплю', xOffset+cellWidth*2, row1YOffset+cellHeight);
  ctx.fillText(`${totalBuy}${params.currency}`, xOffset+cellWidth*5, row1YOffset+cellHeight);

  ctx.fillStyle = RED;
  ctx.fillText(`${totalSell}${params.currency}`, xOffset+cellWidth*7, row1YOffset+cellHeight);
  ctx.fillText('Всего на продажу', xOffset+cellWidth*10, row1YOffset+cellHeight);


  //2 row
  const row2YOffset = headerHeight+yOffset+cellHeight*2;

  ctx.lineWidth = lineWidthLittle;
  ctx.strokeRect(xOffset, row2YOffset, tableWidth, cellHeight*2);
  ctx.strokeRect(xOffset, row2YOffset, cellWidth*2, cellHeight*2);

  ctx.strokeRect(xOffset+cellWidth*2, row2YOffset, cellWidth*2, cellHeight);
  ctx.strokeRect(xOffset+cellWidth*2, row2YOffset+cellHeight, cellWidth, cellHeight);
  ctx.strokeRect(xOffset+cellWidth*3, row2YOffset+cellHeight, cellWidth, cellHeight);

  ctx.strokeRect(xOffset+cellWidth*4, row2YOffset, cellWidth*2, cellHeight*2);
  ctx.strokeRect(xOffset+cellWidth*6, row2YOffset, cellWidth*2, cellHeight*2);

  ctx.strokeRect(xOffset+cellWidth*8, row2YOffset, cellWidth*2, cellHeight);
  ctx.strokeRect(xOffset+cellWidth*8, row2YOffset+cellHeight, cellWidth, cellHeight);
  ctx.strokeRect(xOffset+cellWidth*9, row2YOffset+cellHeight, cellWidth, cellHeight);

  ctx.fillStyle = GREEN;
  ctx.font = 'bold 20px Arial';
  ctx.fillText('№ заявки', xOffset+cellWidth, row2YOffset+cellHeight);
  ctx.fillText('Кол/во', xOffset+cellWidth*3, row2YOffset+cellHeight/2);
  ctx.fillText('min', xOffset+cellWidth*2.5, row2YOffset+cellHeight*1.5);
  ctx.fillText('max', xOffset+cellWidth*3.5, row2YOffset+cellHeight*1.5);
  ctx.fillText('Цена', xOffset+cellWidth*5, row2YOffset+cellHeight);

  ctx.fillStyle = RED;
  ctx.fillText('№ заявки', xOffset+cellWidth*11, row2YOffset+cellHeight);
  ctx.fillText('Кол/во', xOffset+cellWidth*9, row2YOffset+cellHeight/2);
  ctx.fillText('min', xOffset+cellWidth*8.5, row2YOffset+cellHeight*1.5);
  ctx.fillText('max', xOffset+cellWidth*9.5, row2YOffset+cellHeight*1.5);
  ctx.fillText('Цена', xOffset+cellWidth*7, row2YOffset+cellHeight);


  let numOfRows = 0;

  for (const order of orders.buy) {
    createOrderRow(order, "buy");
    numOfRows++;
  }

  numOfRows = 0;
  for (const order of orders.sell) {
    createOrderRow(order, "sell");
    numOfRows++;
  }

  const tableHeight = headerHeight+cellHeight*(4+numOfRows);

  ctx.lineWidth = lineWidthBig;
  ctx.strokeRect(xOffset, yOffset, tableWidth, tableHeight);

  

  function createOrderRow(order, type) {
    const rowOrderYOffset = headerHeight+yOffset+cellHeight*4+numOfRows*cellHeight;

    ctx.lineWidth = lineWidthLittle;
    ctx.strokeRect(xOffset, rowOrderYOffset, tableWidth, cellHeight);

    if (type === "buy") {
      ctx.strokeRect(xOffset, rowOrderYOffset, cellWidth*2, cellHeight);
      ctx.strokeRect(xOffset+cellWidth*2, rowOrderYOffset, cellWidth, cellHeight);
      ctx.strokeRect(xOffset+cellWidth*3, rowOrderYOffset, cellWidth, cellHeight);
      ctx.strokeRect(xOffset+cellWidth*4, rowOrderYOffset, cellWidth*2, cellHeight);

      ctx.fillStyle = GREEN;
      ctx.font = 'italic 16px Arial';
      ctx.fillText(order.id, xOffset+cellWidth, rowOrderYOffset+cellHeight/2);
      ctx.fillText(order.min, xOffset+cellWidth*2.5, rowOrderYOffset+cellHeight/2);
      ctx.fillText(order.max, xOffset+cellWidth*3.5, rowOrderYOffset+cellHeight/2);
      ctx.fillText(order.price, xOffset+cellWidth*5, rowOrderYOffset+cellHeight/2);
    } else {

      ctx.strokeRect(xOffset+cellWidth*6, rowOrderYOffset, cellWidth*2, cellHeight);
      ctx.strokeRect(xOffset+cellWidth*8, rowOrderYOffset, cellWidth, cellHeight);
      ctx.strokeRect(xOffset+cellWidth*9, rowOrderYOffset, cellWidth, cellHeight);

      ctx.fillStyle = RED;
      ctx.font = 'italic 16px Arial';
      ctx.fillText(order.id, xOffset+cellWidth*11, rowOrderYOffset+cellHeight/2);
      ctx.fillText(order.min, xOffset+cellWidth*8.5, rowOrderYOffset+cellHeight/2);
      ctx.fillText(order.max, xOffset+cellWidth*9.5, rowOrderYOffset+cellHeight/2);
      ctx.fillText(order.price, xOffset+cellWidth*7, rowOrderYOffset+cellHeight/2);
    }
  }

  async function addAds() {

    const advSpace = 1;
    const folderPath = `./advertisements/${params.adsFolderName}`;

    let fileName = "1-280х120.png";
    if (file1) {
      const adv = await loadImage(`${folderPath}/${fileName}`);
      ctx.drawImage(adv, xOffset, yOffset, cellWidth*4, headerHeight);
    }
    
    fileName = "2-280х120.png";
    if (file2) {
      const adv = await loadImage(`${folderPath}/${fileName}`);
      ctx.drawImage(adv, xOffset+cellWidth*8, yOffset, cellWidth*4, headerHeight);
    }

    fileName = "3-840х96.png";
    if (file3) {
      const adv = await loadImage(`${folderPath}/${fileName}`);
      ctx.drawImage(adv, xOffset, yOffset+tableHeight+cellHeight, tableWidth, cellHeight*4);
    }

    fileName = "4-410х96.png";
    if (file4) {
      const adv = await loadImage(`${folderPath}/${fileName}`);
      ctx.drawImage(adv, xOffset, yOffset+tableHeight+cellHeight*6, tableWidth/2-advSpace, cellHeight*4);
    }

    fileName = "5-410х96.png";
    if (file5) {
      const adv = await loadImage(`${folderPath}/${fileName}`);
      ctx.drawImage(adv, xOffset+tableWidth/2+advSpace, yOffset+tableHeight+cellHeight*6, tableWidth/2-advSpace, cellHeight*4);
    }

    // bottom borders
    // ctx.lineWidth = lineWidthLittle;
    // ctx.strokeRect(xOffset, yOffset+tableHeight+cellHeight, tableWidth, cellHeight*4);
    // ctx.strokeRect(xOffset, yOffset+tableHeight+cellHeight*6, tableWidth/2-advSpace, cellHeight*4);
    // ctx.strokeRect(xOffset+tableWidth/2+advSpace, yOffset+tableHeight+cellHeight*6, tableWidth/2-advSpace, cellHeight*4);
  }

  await addAds();

  return Buffer.from(canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // const img = Buffer.from(canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // await writeFile("./index.png", img);
  // console.log(`index.png updated`);
}


module.exports.imgGenerate = generate;