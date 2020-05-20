const fs = require('fs');
const path = require('path'); 
const yaml = require('js-yaml')
const {gitDescribeSync} = require('git-describe');

var source = './fontawesome5/metadata/icons.json';
var yamlFile = './fontawesome5/metadata/categories.yml',
    yamlData, yamlKeys;

const faVersion = gitDescribeSync(path.resolve("./fontawesome5"), {
    requireAnnotated: false
});
console.log("Proccesing Fontawesome5 "+faVersion)

try {
    let fileContents = fs.readFileSync(yamlFile, 'utf8');
    yamlData = yaml.safeLoad(fileContents);
    yamlKeys = [];
    for (let key in yamlData) {      
        if (yamlData.hasOwnProperty(key)) yamlKeys.push(key);
    }
} catch (e) {
    console.log(e);
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

fs.readFile(source, 'utf-8', (err, data) => {
    if (err) throw err;
    let results = JSON.parse(data);
    console.log(data.type);

    try {      
        //transform data
        let keys = [];
        for (let key in results) {      
            if (results.hasOwnProperty(key)) keys.push(key);
        }
        //keys = keys.slice(0,10); //comment out on final run
        console.log("Processing "+keys.length.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+" results...");
        keys.forEach(function(key) {
            //console.log(key); Obj key
            if(!key) return;
            const icon = results[key];
            for (let index = 0; index < icon.styles.length; index++) {
                const style = icon.styles[index];

                var svgPath = path.resolve("plugins", "joshuafontany", "fontawesome5", style),
                    svgName = key+".svg",
                    svgLoc = path.resolve(svgPath, svgName);
                var metaPath = path.resolve("plugins", "joshuafontany", "fontawesome5", style),
                    metaName = key+".svg.meta",
                    metaLoc = path.resolve(metaPath, metaName);
                svg = icon.svg[style];
                svgText = svg.raw;
                //write an svg file
                if(svgText) try {
                    fs.mkdir(svgPath, { recursive: true }, (err) => {
                        if (err) throw err;
                    });
                    fs.writeFile(svgLoc,svgText,function(err,res){
                        if(err){
                            console.log("err while saving");
                            console.log(err)
                        }
                        else{
                            console.log(`File saved: ${svgLoc}` );
                            if(res) console.log(res);
                        }
                    });
                } catch (error) {
                    throw(error) ; 
                }
                var meta = {},
                    baseTags = ["$:/tags/Image"];
                for (let j = 0; j < yamlKeys.length; j++) {
                    var cat = yamlKeys[j],
                        catObj = yamlData[cat];
                    if (catObj.icons.includes(key)) {
                        baseTags.push(cat)
                    }
                }
                meta.fields = {
                    title: "$:/icons/fontawesome5/"+style+"/"+key,
                    type: "",
                    name: style+"/"+key,
                    caption: key,
                    style: style,
                    description: icon.label,
                    tags: stringifyList(baseTags.concat(icon.search.terms))
                }
                //write a meta file
                if(meta.fields.title) try {
                        fs.mkdir(metaPath, { recursive: true }, (err) => {
                            if (err) throw err;
                        });
                    fs.writeFile(metaLoc,getFieldStringBlock(meta),function(err,res){
                        if(err){
                            console.log("err while saving");
                            console.log(err)
                        }
                        else{
                            console.log(`File saved: ${metaLoc}` );
                            if(res) console.log(res);
                        }
                    });
                } catch (error) {
                    throw(error) ; 
                }
            }
        });
        console.log("Success!")
        return;
    } catch (error) {
        throw(error);
    }
});