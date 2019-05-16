var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var MUSICS = require('./start1.json')

var DATALENGTH, GAMENAME, GAMEDATA;
var brgin = 0
var library
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  const womusic = db.db('womusic');
  library = womusic.collection('moments_collection');
  console.log("数据库已创建!");
  dealData()
});

function dealData() {
  return new Promise((resolve, reject) => {
    console.log(MUSICS[brgin])
    MUSICS[brgin].id = brgin
    library.insertOne(MUSICS[brgin], (err,res) => {
      console.log(res)
      console.log(err)
      resolve(res)
    })
  }).then(res => {
    update(res)
  })
}

function update(res){
  return new Promise((resolve, reject) => {
    console.log(res)
    var Cuid = Mongo.Types.ObjectId(res.ops[0]._id).toString()
    library.updateOne({ '_id': res.ops[0]._id }, { $set: { 'id': Cuid } })
    resolve()
  }).then(res=>{
    brgin++
    if (brgin < MUSICS.length) {
      console.log(brgin + "----------")
      dealData()
    } else {
      console.log('成功')
    }
  })
}
