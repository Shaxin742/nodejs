var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var ObjectId = require('mongodb').ObjectId
var convert = require('./convert.js')
var compoany = require("./company.json")
var linkman = require("./linkman.json")
var DATALENGTH, gameData;
var brgin = 0;
var doneData,companys;
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  const gxgame = db.db('gxgame');
  const games = gxgame.collection('application');
  const developer = gxgame.collection('developer');
  developer.find({}).toArray((err, data) => {
    companys = data
  })
  const contract = gxgame.collection('contract');
  console.log("数据库已创建!");
  games.find({}).toArray((err, data) => {
    // console.log(data[0]); // 游戏数据
    gameData = data
    DATALENGTH = data.length
    dealData(data[brgin], contract)
  })
});

function dealData(data, library) {
  return new Promise((resolve, reject) => {
    doneData = {
      "name": "游戏合作合同",
    }
    var begin_time, end_time,company_id;
    companys.map(n=>{
      if(n.company_name===data.company_name){
        company_id = n.company_id
      }
    })
    compoany.map(c => { //json中的公司
      if (c.name === data.company_name) {
        begin_time = c.beginTime
        end_time = c.endTime
      }
    })
    var randomVal = Math.floor(Math.random() * 32)
    doneData.company_name = data.company_name
    doneData.company_id = company_id
    doneData.linkman = linkman[randomVal].name
    doneData.phone = String(linkman[randomVal].tel)
    doneData.begin_time = begin_time
    doneData.end_time = end_time
    doneData.url = "http://w4.8zyl.cn:9099/t/" + convert.ConvertPinyin(data.company_name) + ".pdf"
    doneData.app_id = data.id
    doneData.descript = data.descrip[0]
    console.log(doneData)
    resolve(doneData)
  }).then(doneData => {
    if (brgin >= DATALENGTH) {
      db.close();
    } else {
      insertData(library, doneData)
    }
  }).catch(reson => {
    console.log('失败')
  })
}

function insertData(library, data) {
  console.log(data + '+++++++++///------------------')
  return new Promise((resolve, reject) => {
    library.insertOne(data, (err, res) => {
      resolve(res)
    })
  }).then(res => {
    console.log(res)
    update(res, library)
  })
}

function update(res, library) {
  return new Promise((resolve, reject) => {
    var Cuid = Mongo.Types.ObjectId(res.ops[0]._id).toString()
    library.updateOne({ '_id': res.ops[0]._id }, { $set: { 'id': Cuid } })
    // library.updateOne({ '_id': res.ops[0]._id }, { $set: { 'company_id': Cuid } })
    resolve()
  }).then(() => {
    brgin++
    dealData(gameData[brgin], library)
  })
}
