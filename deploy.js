require('dotenv').config();
const fs = require('fs');
const fs_Extra = require('fs-extra');
const path = require('path');

var sourceDir = path.resolve("plugins");
var destinationDir = process.env.DEPLOYDIR;

//delete the old plugins
var plugins = ["joshuafontany/svgtools", "joshuafontany/fontawesome5", "joshuafontany/gameicons"]
plugins.forEach(p => {
    if(fs.existsSync(path.resolve(destinationDir, p))){
        fs.rmdirSync(path.resolve(destinationDir, p), { recursive: true });
    } 
});
//debugger;
// copy folder content
fs_Extra.copy(sourceDir, destinationDir, function (error) {
    if (error) {
        throw error;
    } else {
        console.log("success!");
    }
});