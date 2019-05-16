var fs = require('fs');
let data = require("./top_list.json")
if(data){

}
// console.log(data.data.length)
// var gg = Array.from(new Set(data.data))
// console.log(gg.length)

const newArr = [];
data.data.map((item) => newArr.findIndex(({
    id
  }) => id === item.id) === -1 && newArr.push(item));
  console.log(newArr.length)
fs.writeFile("./dd.json",JSON.stringify(newArr),function(err){
  if(err) throw err;
  else console.log('Chengg ')
})

