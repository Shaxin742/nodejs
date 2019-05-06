var fs = require('fs');
// 删除没有日期的结算报表项
// fs.readFile("./music2220.json", function (err, data) {
//   if (err) { console.log(err) }
//   else {
//     console.log(JSON.parse(data).length)
//     data = JSON.parse(data)
//     data.map(v => {
//       getKey(v).map(c => {
//         if (v[c] === '') {
//           delete v[c];
//         }
//       })
//     })
//   }

//   var gg = JSON.stringify(data)
//   fs.writeFile("handledData.json",  gg)
// })

// function getKey(v) {
//   var keyArr = []
//   for (var i in v) {
//     keyArr.push(i)
//   }
//   return keyArr
// }

// 处理公司合同开始时间
// let sqlStr = "SELECT * FROM mf_contract WHERE is_channel >0";
// connection.query(sqlStr, function (err, data) {
//   if (err) {
//     console.log('失败')
//     console.log(err)
//   } else {
//     let channelArr = []
//     console.log(data.length)
//     data.map(v=>{
//       channelArr.push({'company':v.party_a_org_name,'beginTime':v.start_time})
//     })
//     fs.writeFile("constract.json", JSON.stringify(channelArr))
//   }
// });

let constractArr = []
fs.readFile("./constract.json", function (err, data) {
  if (err) { console.log(err) }
  else {
    console.log(JSON.parse(data).length)
    constractArr = JSON.parse(data)
    
  }
})

fs.readFile("./handledData.json", function (err, data) {
  if (err) { console.log(err) }
  else {
    // console.log(JSON.parse(data).length)
    data = JSON.parse(data)
    data.map(v => {
      constractArr.map(c => {
        if (v.orgName === c.company) {
          console.log(v.orgName)
          let HandleArr = []
          for (var i in v) {
            HandleArr.push(i)
          }
          console.log(c)
          console.log(HandleArr[HandleArr.length - 2])
          c.endTime = HandleArr[HandleArr.length - 2]
          console.log(c)
        }
      })
    })

    fs.writeFile("LASTED.json", JSON.stringify(constractArr))
  }
})
