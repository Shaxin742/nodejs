var Mongo = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.0.10.1";
var ObjectId = require('mongodb').ObjectId
var contracts,games,DATALENGTH;
var brgin = 0
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  const gxgame = db.db('gxgame');
  const games = gxgame.collection('application');
  const contract = gxgame.collection('contract');
  contract.find({}).toArray((err, data) => {
    contracts = data
  })
  console.log("数据库已创建!");
  games.find({}).toArray((err, data) => {
    gameData = data
    DATALENGTH = data.length
    dealData(data[brgin], games)
  })
});

function dealData(data,library){
  return new Promise((resolve,reject)=>{
    contracts.map(v=>{
      if(v.app_id ===data.id){
        // console.log(v.id+'----------------')
        // console.log(data.id+"++++++++++++")
        library.update({ 'contract_id': data.contract_id }, { $set: { 'contract_id': v.id} }).then(callback=>{
          // if(callback.result.nModified>0){
          //   dealData(gameData[brgin], library)
          // }else{
            console.log(callback.result)
            resolve()
          // }
        })
      }
    })
  }).then(res=>{
    brgin++
    if(brgin<DATALENGTH){
      dealData(gameData[brgin], library)
    }else{
      db.close()
    }
  }).catch(result=>{
    console.log("失败")
  })
}
