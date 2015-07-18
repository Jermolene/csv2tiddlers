(function(){

"use strict";

var fs = require("fs"),
	parse = require("csv").parse;

/*

You'll need to adjust the following

*/

convertCSVtoJSON(
	"./data/Greatest films of all time.csv", // Filename of input file
	"./films.json", // Filename of output file
	{
		"skip-first": true, // Whether to skip the first row of the file
		"tags": ["$:/Films"], // Tags to be applied to all generated tiddlers
		"columns": [
			{"name":"Genre",				"type":"string","field": "data-genre"},
			{"name":"Entry",				"type":"string","field": "data-entry"},
			{"name":"Film",					"type":"string","field": "title"},
			{"name":"Director",				"type":"string","field": "data-director"},
			{"name":"Leading actors",		"type":"comma-separated-tags"},
			{"name":"Year",					"type":"string","field": "data-year"},
			{"name":"No of Oscars",			"type":"string","field": "data-oscars"},
			{"name":"IMDB link",			"type":"string","field": "data-imdb-url"},
			{"name":"Guardian film page",	"type":"string","field": "data-guardian-url"},
			{"name":"Country",				"type":"string","field": "data-country"}
		]
	}
);

/////////// Main function

function convertCSVtoJSON(pathnameIn,pathnameOut,options) {
	var parser = parse({delimiter: ","},function(err,data) {
			if(err) {
				console.log("Error reading CSV file '" + pathnameIn + "': " + err)
			} else {
				generateJSON(data,pathnameOut,options);
			}
		});
	fs.createReadStream(pathnameIn).pipe(parser);
}

/////////// Helper functions

function generateJSON(data,pathnameOut,options) {
	var output = [],
		skipFirst = !!options["skip-first"],
		addedTags = options.tags || [];
	data.forEach(function(row,rowIndex) {
		if(rowIndex || !skipFirst) {
			var tiddler = {};
			options.columns.forEach(function(columnInfo,columnIndex) {
				var field = columnInfo.field,
					value = row[columnIndex];
				switch(columnInfo.type) {
					case "string":
						if(columnInfo.prefix) {
							value = columnInfo.prefix + value;
						}
						break;
					case "comma-separated-tags":
						value = value.split(",");
						if(addedTags) {
							value = value.concat(addedTags);
						}
						value.forEach(function(tag,tagIndex) {
							value[tagIndex] = "[[" + (columnInfo.prefix || "") + tag.trim() + "]]";
						});
						value = value.join(" ");
						field = "tags";
						break;
				}
				tiddler[field] = value;
			});
			output.push(tiddler);
		}
	});
	fs.writeFileSync(pathnameOut,JSON.stringify(output,null,4),"utf8")
}

// Turns a string into a legal JavaScript string
// Copied from peg.js, thanks to David Majda
function escapeJavaScriptString(s) {
	/*
	* ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a string
	* literal except for the closing quote character, backslash, carriage return,
	* line separator, paragraph separator, and line feed. Any character may
	* appear in the form of an escape sequence.
	*
	* For portability, we also escape all non-ASCII characters.
	*/
	return (s || "")
		.replace(/\\/g, '\\\\')            // backslash
		.replace(/"/g, '\\"')              // double quote character
		.replace(/'/g, "\\'")              // single quote character
		.replace(/\r/g, '\\r')             // carriage return
		.replace(/\n/g, '\\n')             // line feed
		.replace(/[\x80-\uFFFF]/g, exports.escape); // non-ASCII characters
};

})();