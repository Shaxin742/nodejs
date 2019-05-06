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

fs.readFile("./LASTED.json", function (err, data) {
  if (err) { console.log(err) }
  else {
    console.log(data)
    data = JSON.parse(data)
    data.map(v => {
      for (var i = transTimeToYM(v.beginTime); i < v.endTime; i++) {
        if (String(i).substring(String(i).length, String(i).length - 2) === '13') {
          var before2 = Number(String(i).substring(0, 2))
          before2 += 1
          var last2 = String(i).substring(String(i).length, String(i).length - 2)
          last2 = '01'
          i = String(before2) + last2
        }
        let Cur = '20' + String(i).substring(0, 2) + '-' + String(i).substring(2, 4) + "-" + mGetDate(String(i).substring(0, 2), String(i).substring(2, 4), 0) + " 00:00:00"
        console.log(Cur)
        console.log(transToTimestamp(Cur))
        let insertData = [transToTimestamp(Cur), 1, '结算报表', '本月结算报表已生成', v.id, v.company, 1]
        insertTable(insertData)
      }
    })
  }
})
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
function mGetDate(year, month) { // 获取月份日期
  var d = new Date(year, month, 0);
  return d.getDate();
}
// function getBegin(v) {
//   var dateTran = new Date(v)
//   var yy = String(dateTran.getFullYear()).substring(2, 4)
//   var mm = dateTran.getMonth() + 1;
//   mm = (mm).length > 1 ? mm : '0' + mm
//   return yy + mm
// }

function transTimeToYM(v) {
  var dateTran = new Date(v)
  var yy = String(dateTran.getFullYear()).substring(2, 4)
  var mm = dateTran.getMonth() + 1
  mm = String(mm).length > 1 ? String(mm) : '0' + String(mm)
  // var mm = String(dateTran.getMonth()).length > 1 ? String(dateTran.getMonth()) : '0' + String(dateTran.getMonth())
  return yy + mm
}

function transToTimestamp(v) {
  return parseInt(new Date(v).getTime() / 1000)
}
