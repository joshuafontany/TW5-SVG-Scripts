const fs = require('fs');
const ParseCSV = require('./parse-csv.js');

var source = './gameicons/iconTags.csv';
var dest = './gameicons/iconTags.json';

var results = ParseCSV.parse(source);
//transform data



//write file
fs.writeFile(dest,JSON.stringify(results, null, 4),function(err,res){
    if(err){
        console.log("err while saving");
        console.log(err)
    }
    else{
        console.log(`File saved: ${dest}` );
        if(res) console.log(res);
    }
});