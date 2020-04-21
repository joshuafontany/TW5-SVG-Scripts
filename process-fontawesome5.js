const fs = require('fs');

var source = './fontawesome5/metadata/icons.json';

// Stringify an array of tiddler titles into a list string
$tw.utils.stringifyList = function(value) {
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
        console.log("Processing "+results.length.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+" results...");
        //transform data
        let keys = [];
        for (let key in results) {      
            if (results.hasOwnProperty(key)) keys.push(key);
        }
        keys = keys.slice(0,10); //comment out on final run
        keys.forEach(function(key) {
            //console.log(key); Obj key
            if(!key) return;
            const icon = results[key];
            for (let index = 0; index < icon.styles.length; index++) {
                const style = icon.styles[index];
                var svgPath = path.resolve("fontawesome5", "icons" , style),
                    svgName = key+".svg.meta",
                    svgLoc = path.resolve(svgPath, svgName);
                var metaPath = path.resolve("fontawesome5", "icons" , style),
                    metaName = key+".svg.meta",
                    metaLoc = path.resolve(metaPath, metaName);
                svg = 
                meta.fields = {
                    title: "$:/icons/fontawesome5/"+svg.name,
                    name: svg.name,
                    caption: svg.name.split('/')[1],
                    tags: svg.tags,
                    description: svg.description
                }


            }
        });
        return;
    } catch (error) {
        throw(error);
    }
});