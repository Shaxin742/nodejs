var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var comments = require('./comments.json')

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
    var commentsArr = []
    for (var i=0;i< Math.floor(Math.random() * 3) + 3;i++) {
      commentsArr.push(comments[Math.floor(Math.random() * comments.length)])
    }
    console.log(commentsArr.length)
    library.update({ 'id': data.id }, { $set: { 'comments':  commentsArr} }).then(callback1 => {
      resolve(library)
    })
  }).then(res => {
    if(brgin<DATALENGTH){
      brgin++
      dealData(GAMEDATA[brgin],library)
    }else{
      console.log('结束')
    }
  }).catch(result => {
    console.log("失败")
  })
}
