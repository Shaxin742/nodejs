var mysql = require('mysql');
var fs = require('fs');
var connection = mysql.createConnection({
  host: "10.0.10.5",    // 主机地址
  port: 3306,                 // 端口
  user: "root",               // 数据库访问账号
  password: "urock12345",     // 数据库访问密码
  database: "music",           // 要访问的数据库
  charset: "UTF8_GENERAL_CI", // 字符编码 ( 必须大写 )
  typeCast: true,             // 是否把结果值转换为原生的 javascript 类型
  supportBigNumbers: true,    // 处理大数字 (bigint, decimal), 需要开启 ( 结合 bigNumberStrings 使用 )
  bigNumberStrings: true,     // 大数字 (bigint, decimal) 值转换为javascript字符对象串
  multipleStatements: false,  // 允许每个mysql语句有多条查询, 未防止sql注入不开启
});
connection.connect(function (err) {
  if (err) console.log('与MySQL数据库建立连接失败。');
  else {
    console.log('与MySQL数据库建立连接成功。');
  }
});
let timeArr = ["2012-07-16","2012-10-15","2013-01-15","2013-04-15","2013-07-15","2013-10-15","2014-01-15","2014-04-15","2014-07-15","2014-10-15","2015-01-15","2015-04-15","2015-07-15","2015-10-15","2016-01-15","2016-04-15","2016-07-15","2016-10-17","2017-01-16","2017-04-17","2017-07-17","2017-10-16"]


fs.readFile("./LASTED.json", function (err, data) {
// fs.readFile("./test.json", function (err, data) {
  if (err) { console.log(err) }
  else {
    data = JSON.parse(data)
    data.map(jsonData => {
      let sqlStr = "SELECT * FROM mf_song_list WHERE org_name = ?";
      connection.query(sqlStr, jsonData.company, function (err, data) {
        if (err) {
          console.log('失败')
          console.log(err)
        } else {
          console.log('-----------------------------------------------')
          let rand = Math.ceil(Math.random()*data.length)
          let Adddata = []
          // console.log(data[rand])
          let BBBtim = randTime(jsonData.beginTime)
          Adddata.push(transToTimestamp(BBBtim),1,jsonData.company,data[rand].music_id,'bo_test','拨测管理',jsonData.company,data[rand].name,'1',BBBtim)
          insertTable(Adddata)
          getBeginIndex(jsonData.beginTime,timeArr).then(beginres=>{
            // console.log("初始值"+beginres) // 初始值
            getEndIndex(jsonData.endTime,timeArr).then(endres=>{
              // console.log("结束之"+endres) // 结束值
              // endres = endres || 21
              if(endres<beginres){
                endres = beginres
              }
              for(var i=beginres;i<=endres;i++){
                Adddata = []
                // console.log(timeArr[i])
                let Rand2 = Math.ceil(Math.random()*data.length)
                let TTTim = ''
                TTTim = randTime(timeArr[i])
                console.log(TTTim)
                console.log(transToTimestamp(TTTim))
                if(TTTim){
                  Adddata.push(transToTimestamp(TTTim),1,jsonData.company,data[Rand2].music_id,'bo_test','拨测管理',jsonData.company,data[Rand2].name,'1',TTTim)
                  insertTable(Adddata)
                }
              }
            })
          })
        }
      });
    })
  }

  var gg = JSON.stringify(data)
  fs.writeFile("handledData.json", gg)
})

function insertTable(insertData){
  let sqlInsertStr = "INSERT INTO mf_bo_test_log (create_time, status, operator, operator_id, description, location, org, operator_name, price, log_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?,? )";
  connection.query(sqlInsertStr, insertData, function (err, data) {
    if (err) {
      // console.log('失败')
      console.log(err)
    } else {
      console.log('成功')
    }
  });
}

function getKey(v) {
  var keyArr = []
  for (var i in v) {
    keyArr.push(i)
  }
  return keyArr
}

function randTime(v) {
  let dat = getTime(v)
  let ranHours = Math.ceil(Math.random() * (17 - 9) + 9)
  let ranMinu = Math.ceil(Math.random() * 59)
  let ranSec = Math.ceil(Math.random() * 59)
  var gg = " " + (JSON.stringify(ranHours).length > 1 ? JSON.stringify(ranHours) : '0' + JSON.stringify(ranHours)) + ":" +
    (JSON.stringify(ranMinu).length > 1 ? JSON.stringify(ranMinu) : '0' + JSON.stringify(ranMinu)) + ":" +
    (JSON.stringify(ranSec).length > 1 ? JSON.stringify(ranSec) : '0' + JSON.stringify(ranSec))
  return dat+gg
}

function getTime(v) { // 时间转时间格式 年月日
  v = new Date(v)
  let yy = v.getFullYear()
  let mm = v.getMonth() + 1
  let ss = v.getDate()
  return yy + "-" + (JSON.stringify(mm).length > 1 ? JSON.stringify(mm) : '0' + JSON.stringify(mm)) + "-" + (JSON.stringify(
    ss).length > 1 ? JSON.stringify(ss) : '0' + JSON.stringify(ss))
}

function transToTimestamp(v){
  return parseInt(new Date(v).getTime()/1000)
}

// let sqlStr = "INSERT INTO mf_bo_ce_log (create_time, status, operator, operator_id, description, location, org, operator_name, price, log_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?,? )";
// connection.query(sqlStr, Adddata, function (err, data) {
//   if (err) {
//     console.log('失败')
//     console.log(err)
//   } else {
//     console.log('成功')
//   }
// });

function getBeginIndex(val,arr){
  return new Promise((resolve,reject)=>{
    let BeginIndex = 0
    for(var i=0;i<arr.length;i++){
      if(arr[i] >= getTime(val)){
        BeginIndex = i;
        resolve(BeginIndex+1)
        break;
      }
    }
  })
}

function getEndIndex(val,arr){
  return new Promise((resolve,reject)=>{
    let EndIndex = 0
    for(var j=0;j<arr.length;j++){
      let endTimeYear = val.substring(0,2)
      let endTimeMonth = val.substring(2,4)
      let endTim = '20'+endTimeYear+"-"+endTimeMonth+'-01'
      if(endTim < arr[j]){
        EndIndex = j;
        // console.log(EndIndex+'爱啥啥到货单')
        resolve(EndIndex)
        break;
      }
      resolve(21)
    }
  })
}
