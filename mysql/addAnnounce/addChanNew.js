var mysql = require('mysql');
var fs = require('fs');
var connection = mysql.createConnection({
  // host: "192.168.107.84",    // 主机地址
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

fs.readFile("./channel_name.json", function (err, Namedata) {
  if (err) { console.log(err) }
  Namedata = JSON.parse(Namedata)
  Namedata.map(nameD => {
    getOrgId(nameD).then(res => {
      let orgId = res;
      console.log(orgId)
      var arr = []
      getCurChan().then(ChanRes=>{
        console.log(ChanRes[0].org_name)
        console.log(nameD.name)
        ChanRes.map(Chan=>{
          if(Chan.org_name === nameD.name){
            arr.push(Chan)
          }
        })
        console.log(arr)
        arr.map(nnn=>{
          let insertData = [transToTimestamp(nnn.start_time), 1, '结算报表', '本月结算报表已生成', orgId, nnn.org_name, 1]
          insertTable(insertData)
        })
      })
    })
  })
})

function transToTimestamp(v) {
  return parseInt(new Date(v).getTime() / 1000)
}

function getCurChan(){
  return new Promise(resolve=>{
    fs.readFile("./channel.json", function (err, comData) {
      if (err) { console.log(err) }
      comData = JSON.parse(comData)
      resolve(comData)
    })
  })
}

function getOrgId(v) {
  return new Promise(resolve => {
    let sqlSearchStr = "SELECT * FROM mf_organization WHERE `name` = ?";
    connection.query(sqlSearchStr, v.name, function (err, data) {
      if (err) {
        console.log('失败')
      } else {
        resolve(data[0].id)
      }
    });
  })
}

function insertTable(insertData) {
  let sqlInsertStr = "INSERT INTO mf_announcement (create_time, status,  title, content, org_id, org_name, is_channel) values (?, ?, ?, ?, ?,?, ? )";
  connection.query(sqlInsertStr, insertData, function (err, data) {
    if (err) {
      // console.log('失败')
      console.log(err)
    } else {
      console.log('成功')
    }
  });
}
