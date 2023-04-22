import require$$0 from 'lodash/fp.js';
import require$$1 from 'moo';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var gherkin_umd$1 = {exports: {}};

(function (module) {
	// Generated automatically by nearley, version 2.20.1
	// http://github.com/Hardmath123/nearley
	(function () {
	function id(x) { return x[0]; }

	const fp = require$$0;
	const moo = require$$1;
	const lexer = moo.compile({
	  ws : /[ \t]+/,
	  feature : 'Feature:',
	  scenarioOutline : 'Scenario Outline:',
	  given : 'Given',
	  when : 'When',
	  then : 'Then',
	  example : 'Example:',
	  scenario : 'Scenario:',
	  text : /[^\n]+/,
	  newline : { match : '\n', lineBreaks : true },
	});
	var grammar = {
	    Lexer: lexer,
	    ParserRules: [
	    {"name": "main", "symbols": ["feature"], "postprocess": id},
	    {"name": "feature", "symbols": [(lexer.has("feature") ? {type: "feature"} : feature), "text", (lexer.has("newline") ? {type: "newline"} : newline), "freeform", (lexer.has("newline") ? {type: "newline"} : newline), "statements"], "postprocess": 
	        (data) => { return { name : data[1], description : data[3], statements : data[5] } }
	        },
	    {"name": "statements", "symbols": [], "postprocess": data => []},
	    {"name": "statements", "symbols": ["statements", "_", "exampleKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline), "steps"], "postprocess": 
	        (data) => { return fp.concat(data[0],{ type : data[2], name : data[3], steps : data[5] }) }
	        },
	    {"name": "statements", "symbols": ["statements", "_", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": id},
	    {"name": "exampleKeyword", "symbols": [(lexer.has("example") ? {type: "example"} : example)]},
	    {"name": "exampleKeyword", "symbols": [(lexer.has("scenario") ? {type: "scenario"} : scenario)], "postprocess": data => data[0].type},
	    {"name": "steps", "symbols": ["given", "when", "then"], "postprocess": (data) => { return { given : data[0], when : data[1], then : data[2] } }},
	    {"name": "given", "symbols": [], "postprocess": data => []},
	    {"name": "given", "symbols": ["given", "_", (lexer.has("given") ? {type: "given"} : given), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[0],{ text : data[3] })},
	    {"name": "when", "symbols": [], "postprocess": data => []},
	    {"name": "when", "symbols": ["when", "_", (lexer.has("when") ? {type: "when"} : when), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[0],{ text : data[3] })},
	    {"name": "then", "symbols": [], "postprocess": data => []},
	    {"name": "then", "symbols": ["then", "_", (lexer.has("then") ? {type: "then"} : then), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[0],{ text : data[3] })},
	    {"name": "text", "symbols": ["_", (lexer.has("text") ? {type: "text"} : text)], "postprocess": data => data[1].value},
	    {"name": "freeform", "symbols": [], "postprocess": data => ""},
	    {"name": "freeform", "symbols": ["freeform", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[0] + data[1] + data[2]},
	    {"name": "_", "symbols": []},
	    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => null}
	]
	  , ParserStart: "main"
	};
	{
	   module.exports = grammar;
	}
	})(); 
} (gherkin_umd$1));

var gherkin_umdExports = gherkin_umd$1.exports;
var gherkin_umd = /*@__PURE__*/getDefaultExportFromCjs(gherkin_umdExports);

export { gherkin_umd as default };
