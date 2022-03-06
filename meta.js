const fs = require('fs');
  
// Use fs.readFile() method to read the file
map = {}
fs.readFile('meta.txt', (err, data) => {
    var list = data.toString('utf8').split("\n");
    for (var inx in list) {
        var item = list[inx].split("=")
        map[item[0]] = item[1].replace("\r", "");
    }

    console.log(map);

    fs.writeFileSync("meta.json", JSON.stringify(map));
 })