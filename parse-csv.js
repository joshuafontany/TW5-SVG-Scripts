const fs = require('fs');
const Papa = require('papaparse');
const default_config = {
	delimiter: "",	// auto-detect
	newline: "",	// auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: true,
	transformHeader: undefined,
	dynamicTyping: false,
	preview: 0,
	encoding: "",
	worker: false,
	comments: false,
	step: undefined,
	complete: undefined,
	error: undefined,
	download: false,
	downloadRequestHeaders: undefined,
	skipEmptyLines: false,
	chunk: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined,
	transform: undefined,
	delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
}

var parse = function (csvFile) {
	var file;
	try {
		file = fs.readFileSync(csvFile, "utf8");
	} catch(e) {
		console.log('Error:', e.stack);
	}
	var results = Papa.parse(file, default_config);
	return results;
  }

  module.exports = {
	parse
  };

 // parse('./gameicons/iconTags.csv', './gameicons/iconTags.json');