var xlsx = require('node-xlsx');
var fs = require('fs');
var arr = []
var sheets = xlsx.parse("./" + "start.xlsx");
// console.log(JSON.stringify(obj));
// sheets.forEach(sheet => {
//   // for (var i = 0; i < sheet['data']; i++) {
//     dealImg(sheet['data'])
//   // }
// })
var index = 0
var SheIndex = 2
var SHEETDATA = sheets[SheIndex]['data']
var arr = []
dealImg(SHEETDATA)
// fs.writeFile("start.json", JSON.stringify(arr), function (err) {
//   if (err) throw err;
//   console.log('Write to xls has finished');
// })
var mov_url, img_url
console.log(sheets.length - 1)
function dealImg(data) {
  return new Promise((resolve, reject) => {
    img_url = []
    if (data[index][3] !== null) {
      for (var i = 0; i < data[index][3]; i++) {
        img_url.push("http://w4.8zyl.cn:9099/wi/" + data[index][4] + "_" + (i + 1) + '.png')
      }
    }
    resolve()
  }).then(() => {
    dealVideo(data)
  })
}

function dealVideo(data) {
  return new Promise((resolve, reject) => {
    mov_url = []
    if (data[index][5] > 1) {
      for (var i = 0; i < data[index][5]; i++) {
        mov_url.push({
          img: "http://w4.8zyl.cn:9099/wi/" + data[index][6] + "_" + (i + 1) + '.png',
          url: "http://w4.8zyl.cn:9099/wm/" + data[index][6] + "_" + (i + 1) + ".mp4"
        })
      }
    } else {
      for (var i = 0; i < data[index][5]; i++) {
        mov_url.push({
          img: "http://w4.8zyl.cn:9099/wi/" + data[index][6] + "_" + (i + 1) + '.png',
          url: "http://w4.8zyl.cn:9099/wm/" + data[index][6] + ".mp4"
        })
      }
    }
    resolve()
  }).then(() => {
    makeData(data)
  })
}
function makeData(data) {
  return new Promise((resolve, reject) => {
    if (!img_url) { img_url = [] }
    if (!mov_url) { mov_url = [] }
    // console.log(mov_url)
    arr.push({
      "name": data[index][0],
      "datetime": data[index][1],
      "content": data[index][2],
      img_url: img_url,
      mov_url: mov_url
    })
    resolve(arr)
  }).then(arr => {
    index++
    if (index < SHEETDATA.length) {
      dealImg(sheets[SheIndex]['data'])
      // } else if(SheIndex < sheets.length-1) {
      //   index = 0
      //   SheIndex++
      //   console.log('jinl')
      //   dealImg(sheets[SheIndex]['data'])
    } else {
      fs.writeFile("start.json", JSON.stringify(arr), function (err) {
        if (err) throw err;
        console.log('Write to xls has finished');
      })
    }
  }).catch((e) => {
    console.log(e)
    fs.writeFile("start.json", JSON.stringify(arr), function (err) {
      if (err) throw err;
      console.log('Write to xls has finished');
    })
  })
}

