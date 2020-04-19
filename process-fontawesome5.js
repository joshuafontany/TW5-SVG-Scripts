const fs = require('fs');

var source = './fontawesome5/metadata/icons.json';
var dest = './fontawesome5/icons/';

fs.readFile(source, 'utf-8', (err, data) => {
    if (err) throw err;
    let results = JSON.parse(data);
    console.log(data.type);

    try {
        console.log("Processing "+results.length.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+" results...");
    return;
    } catch (error) {
        throw(error);
    }
});

//transform data



/* write file
writeFile(dest,JSON.stringify(results, null, 4),function(err,res){
    if(err){
        console.log("err while saving");
        console.log(err)
    }
    else{
        console.log(`File saved: ${dest}` );
        if(res) console.log(res);
    }
});
*/