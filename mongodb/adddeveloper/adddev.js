var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var ObjectId = require('mongodb').ObjectId
var convert = require('./convert.js')
var tels = require("./tel.json")
var randomName = require("chinese-random-name");
var brgin = 0;
var GAMEDATA, library
for(var i=0;i<10;i++){
  console.log(randomName.generate())
}
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  const gxgame = db.db('gxgame');
  library = gxgame.collection('developer');
  library.find({}).toArray((err, data) => {
    GAMEDATA = data
    // console.log(data[brgin])
    dealData(GAMEDATA[brgin])
  })
});

function dealData(data) {
  return new Promise((resolve, reject) => {
    var addd = String(Math.floor(Math.random() * 10000))
    if (addd.length < 2) {
      addd = '000' + addd
    } else if (addd.length < 3) {
      addd = '00' + addd
    } else if (addd.length < 4) {
      addd = '0' + addd
    }
    var tel = String(tels[Math.floor(Math.random() * tels.length)]) + addd
    console.log(data)
    let name = randomName.generate()
    library.updateMany({ 'id': data.id },
      {
        $set: {
          // id: Mongo.Types.ObjectId(data._id).toString(),
          // name: convert.ConvertPinyin(data.name),
          // mobile: tel,
          name: convert.ConvertPinyin(name),
          nickname:name
          // mail: tel + '@163.com',
          // head_url: 'http://w4.8zyl.cn:9099/u/' + (Math.floor(Math.random() * 2000)) + '.jpg'
        }
      }).then(res => {
        resolve(res.result)
      })
  }).then(res => {
    console.log(res)
    brgin++
    if (brgin < GAMEDATA.length) {
      dealData(GAMEDATA[brgin])
    } else {
      console.log("完成")
    }
  })
}

