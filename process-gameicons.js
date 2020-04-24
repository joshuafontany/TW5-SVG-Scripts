const fs = require('fs');
var fs_Extra = require('fs-extra');
const path = require('path');

var sourceDir = path.resolve("gameicons", "icons");
var destinationDir = path.resolve("plugins", "joshuafontany", "gameicons");
// if folder doesn't exists create it
if(!fs.existsSync(destinationDir)){
    fs.mkdirSync(destinationDir, { recursive: true });
}

//from the tiddler widget
getFieldStringBlock = function(obj, options) {
	options = options || {};
	var exclude = options.exclude || [],
		fields = Object.keys(obj.fields).sort(),
		result = [];
	for(var t=0; t<fields.length; t++) {
		var field = fields[t];
		if(exclude.indexOf(field) === -1) {
			result.push(field + ": " + obj.fields[field].toString());
		}
	}
	return result.join("\n");
};
// Stringify an array of tiddler titles into a list string
stringifyList = function(value) {
	if(Object.prototype.toString.call(value) == "[object Array]") {
		var result = new Array(value.length);
		for(var t=0, l=value.length; t<l; t++) {
			var entry = value[t] || "";
			if(entry.indexOf(" ") !== -1) {
				result[t] = "[[" + entry + "]]";
			} else {
				result[t] = entry;
			}
		}
		return result.join(" ");
	} else {
		return value || "";
	}
};

var source = './gameicons/iconTags.json';
fs.readFile(source, 'utf-8', (err, fileContent) => {
    if(err) {
        console.log(err); // Do something to handle the error or just throw it
        throw new Error(err);
    }
    var results = JSON.parse(fileContent);
    console.log(results.data.length);
    //transform data
    let keys = [];
    for (let key in results.data) {      
        if (results.data.hasOwnProperty(key)) keys.push(key);
    }
    keys.forEach(function(key) {
        //console.log(key); Array index
        const svg = results.data[key];
        if(!svg.name.length) return;
        var filePath = path.resolve("plugins", "joshuafontany", "gameicons", svg.name.split('/')[0]);
        var fileName = svg.name.split('/')[1]+".svg.meta";
        var loc = path.resolve(filePath, fileName);
        var baseTags = ["$:/tags/Image"];
        svg.fields = {
            title: "$:/icons/gameicons/"+svg.name,
            type: "",
            name: svg.name,
            caption: svg.name.split('/')[1],
            tags: stringifyList(baseTags)+" "+svg.tags,
            description: svg.description,
        }
        //write a meta file
        if(svg.fields.title) try {
                fs.mkdir(filePath, { recursive: true }, (err) => {
                    if (err) throw err;
                });
            fs.writeFile(loc,getFieldStringBlock(svg),function(err,res){
                if(err){
                    console.log("err while saving");
                    console.log(err)
                }
                else{
                    console.log(`File saved: ${loc}` );
                    if(res) console.log(res);
                }
            });
        } catch (error) {
            throw(error) ; 
        }  
    });

    // copy icons folder content
    fs_Extra.copy(sourceDir, destinationDir, function (error) {
    if (error) {
        throw error;
    } else {
        console.log("success!");
    }
    });
});