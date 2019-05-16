var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var ObjectId = require('mongodb').ObjectId
var randomName = require("chinese-random-name");
var gameData = require("./game.json")
var teldata = require("./tel.json")
var convert = require('./convert.js')
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  const gxgame = db.db('gxgame');
  const user1 = gxgame.collection('user');
  dealData(user1)
});
var littT = '0'
var largT = '0'
var indexs = 0;
var data = {}
function dealData(user1) {
  return new Promise((resolve, reject) => {
    indexs++
    var INSERTNAME = randomName.generate()
    var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    var len = Math.random()*7+6 // 6-13位
    var PW = '' // 密码
    for(var i=0;i<len;i++){
      PW+= arr[Math.floor(Math.random()*arr.length)]
    }
    var randomGameNum = Math.floor(Math.random() * 41 + 30)
    var gameIndex = Math.floor(Math.random() * (83 - randomGameNum))
    var gameAll = randomGameNum+gameIndex
    var games = []
    var tel = 0;
    if (littT > 99) { littT = '0' };
    if (largT > 9999) { largT = '0' };
    var telIndex = parseInt(indexs / 7.5)
    console.log(gameIndex)
    console.log(randomGameNum)
    for (var i = gameIndex; i < gameAll; i++) {
      games.push(gameData[i])
    }
    console.log(games.length+"******************")
    if (String(teldata[telIndex]).length > 7) {
      littT = Number(littT) + Math.floor(Math.random() * 12.5 + 1)
      littT = String(littT).length > 1 ? littT : '0' + littT
      tel = String(teldata[telIndex]) + String(littT)
    } else {
      largT = Number(largT) + Math.floor(Math.random() * 1250 + 1)
      if (String(largT).length < 2) {
        largT = '000' + largT
      } else if (String(largT).length < 3) {
        largT = '00' + largT
      } else if (String(largT).length < 4) {
        largT = '0' + largT
      }
      tel = String(teldata[telIndex]) + String(largT)
    }
    data = {
      // id: ObjectId,
      name: convert.ConvertPinyin(INSERTNAME),
      passwd: PW,
      nickname: INSERTNAME,
      head_url: 'http://w4.8zyl.cn:9099/u/' + (Math.floor(Math.random() * 2000)) + '.jpg',
      mobile: tel,
      mail: "",
      purchases: games,
      indx: indexs,
      comments: [],
      notification: []
    }
    resolve()
  }).then(function (result) {
    if (indexs <= 1601584) {
      insertData(user1, data)
    }else{
      db.close();
      console.log("数据库关闭")
    }
  }).catch(function (reason) {
    console.log('失败：');
  });
}

function insertData(library, data) {
  return new Promise((resolve, reject) => {
    library.insertOne(data, (err, res) => {
      resolve(res)
    })
  }).then(res => {
    console.log(indexs + "----------")
    update(res,library)
  })
}

function update(res,library){
  return new Promise((resolve, reject) => {
    var Cuid = Mongo.Types.ObjectId(res.ops[0]._id).toString()
    library.updateOne({ '_id': res.ops[0]._id }, { $set: { 'id': Cuid } })
    resolve()
  }).then(res=>{
    dealData(library)
  })
}
