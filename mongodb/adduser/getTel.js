var xlsx = require('node-xlsx');
var fs = require('fs');
var sheets = xlsx.parse('./123.xlsx');//获取到所有sheets
console.log(JSON.stringify(sheets[0]['data']))
var arr = []
sheets[0]['data'].map(v => {
  v.map(c => {
    arr.push(c)
  })
})

fs.writeFile('./123.json', JSON.stringify(arr), err => {
  if (err) throw err;
  console.log('Write to xls has finished');
})
