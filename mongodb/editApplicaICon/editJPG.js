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
var Con = 0
function dealData(data, library) {
  return new Promise((resolve, reject) => {
    // console.log(data.versions[0].download_num)
    Con+=data.versions[0].download_num
    console.log(Con)
    resolve()
    // var arr = [1,2]
    // library.update({ 'id': data.id }, { $set: { 'arr': arr} }).then(callback => {
    //   console.log(callback)
    // })
  }).then(res => {
    brgin++
    dealData(GAMEDATA[brgin], library)
  }).catch(result => {
    console.log("失败")
  })
}
