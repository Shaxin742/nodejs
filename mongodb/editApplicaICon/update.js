var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var convert = require('./convert.js')
var icons = require("./icon.json")
var DATALENGTH, GAMENAME, GAMEDATA;

var brgin = 0
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  const gxgame = db.db('gxgame');
  const application = gxgame.collection('application');
  console.log("数据库已创建!");
  application.find({}).toArray((err, data) => {
    GAMEDATA = data
    DATALENGTH = data.length
    // console.log(data[brgin])
    dealData(data[brgin], application)
  })
});

function dealData(data, library) {
  return new Promise((resolve, reject) => {
    console.log(data.sku.split(".")[data.sku.split(".").length-1])
    var val = valD = ''
    icons.map(v => {
      GAMENAME = v.split(".")[0]
      if (GAMENAME === data.sku.split(".")[data.sku.split(".").length-1]) {
        val = GAMENAME
        valD = v
      }
    })
    library.update({ 'id': data.id }, { $set: { 'versions.0.big_icon_url': "http://w4.8zyl.cn:9099/c/" + valD } }).then(callback1 => {
      resolve(val)
    })
  }).then(res => {
    editApk(res, library, data)
  }).catch(result => {
    console.log("失败")
  })
}
function editApk(v, library, data) {
  return new Promise((resolve, reject) => {
    console.log(v + '++++++++++++++++++')
    console.log(data.name + '++++++++++++++++++')
    library.update({ 'id': data.id }, { $set: { 'versions.0.apk_url': "http://w4.8zyl.cn:9099/a/" + v + ".apk" } }).then(callback2 => {
      resolve()
    })
  }).then(res => {
    editDownNum(data, library)
  })
}
function editDownNum(data, library) {
  return new Promise((resolve, reject) => {
    console.log(data.name + '++++++++++++++++++')
    library.update({ 'id': data.id }, { $set: { 'versions.0.download_num': (Math.floor(Math.random() * 60000)+140000) } }).then(callback2 => {
      resolve()
    })
  }).then(res => {
    console.log(res)
    brgin++
    if (brgin < DATALENGTH) {
      dealData(GAMEDATA[brgin], library)
    } else {
      db.close()
    }
  })
}


//   // library.update({ 'id': data.id }, { $set: { 'versions.0.download_num': Math.floor(Math.random()*100) } }).then(callback3 => {
    //     resolve()
    //   // })
