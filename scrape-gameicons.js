// https://netterminalmachine.com/blog/2018/blending-nodejs-and-r-projects
const fs = require('fs');
const path = require('path');
const spawn = require("child_process").spawn;
require('dotenv').config();

const ParseCSV = require('./parse-csv.js');

// this is the path to the r text mining cript. It's more or less
// hardcoded here but could be a cmdline arg in a more elaborate setup
const rscriptPath = path.resolve("ScrapeGameIconsNet.r");

const callR = (path) => {
  return new Promise((resolve, reject) => {
    let err = false;
    const child = spawn(process.env.RSCRIPT, ["--vanilla", path, "--args", process.env.RBASEDIR]);
    child.stderr.on("data", (data) => {
      console.log(data.toString());
    });
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    child.on('error', (error) => {
      err=true;
      reject(error);
    });
    child.on('exit', () => {
      if(err) return; // debounce - already rejected
      resolve("done."); // TODO: check exit code and resolve/reject accordingly
    });
  });
}

console.log("Invoking R script... at:", rscriptPath);
callR(rscriptPath)
.then(result => {
    console.log("R script - finished with result:\n", result);
    console.log("Converting CSV to JSON...");
    
    var source = './gameicons/iconTags.csv';
    var dest = './gameicons/iconTags.json';

    var results = ParseCSV.parse(source);
    //write a converted file
    fs.writeFile(dest,JSON.stringify(results, null, 4),function(err,res){
        if(err){
            console.log("err while saving");
            console.log(err)
        }
        else{
            console.log(`File saved: ${dest}` );
            if(res) console.log(res);
            console.log("Manually inspect the results for double escaped sequences such as `\\\"` and other `__parse` errors. ");
            console.log("Manually inspect near `skoll/famas` as well.");
          }
    });
})
.catch(error => {
  console.log("R script - error:\n", error);
});