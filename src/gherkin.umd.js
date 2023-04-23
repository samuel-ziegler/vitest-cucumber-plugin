// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const fp = require('lodash/fp.js');
const moo = require('moo');
const lexer = moo.compile({
  newline : { match : '\n', lineBreaks : true },
  ws : /[ \t]+/,
  colon : ':',
  pipe : '|',
  backSlash : '\\',
  word : {
    match : /[^ \t\n:|\\]+/,
    type : moo.keywords({
      feature : 'Feature',
      scenarioOutline : 'Scenario Outline',
      scenarioTemplate : 'Scenario Template',
      examples : 'Examples',
      scenarios : 'Scenarios',
      given : 'Given',
      when : 'When',
      then : 'Then',
      example : 'Example',
      scenario : 'Scenario',
    }),
  },
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["feature"], "postprocess": id},
    {"name": "feature", "symbols": ["featureStatement", "freeform", "statements"], "postprocess": 
        (data) => { return { type : 'feature', name : data[0], description : data[1], statements : data[2] } }
        },
    {"name": "featureStatement", "symbols": ["_", (lexer.has("feature") ? {type: "feature"} : feature), "_", (lexer.has("colon") ? {type: "colon"} : colon), "_", "featureName", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        data => data[5]
        },
    {"name": "featureName", "symbols": ["text"], "postprocess": data => data[0]},
    {"name": "statements", "symbols": [], "postprocess": data => []},
    {"name": "statements", "symbols": ["statements", "example"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "statements", "symbols": ["statements", "scenarioOutline"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "statements", "symbols": ["statements", "emptyLine"], "postprocess": data => data[0]},
    {"name": "example", "symbols": ["exampleStatement", "steps"], "postprocess": 
        (data) => { return { type : 'example', name : data[0], steps : data[1] } }
        },
    {"name": "exampleStatement", "symbols": ["_", "exampleKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "_", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[5]},
    {"name": "exampleKeyword", "symbols": [(lexer.has("example") ? {type: "example"} : example)]},
    {"name": "exampleKeyword", "symbols": [(lexer.has("scenario") ? {type: "scenario"} : scenario)]},
    {"name": "scenarioOutline", "symbols": ["scenarioStatement", "steps", "examples"], "postprocess": 
        (data) => { return { type : 'scenarioOutline', name : data[0], steps : data[1], examples : data[2] } }
        },
    {"name": "scenarioStatement", "symbols": ["_", "scenarioOutlineKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[2]},
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)]},
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioTemplate") ? {type: "scenarioTemplate"} : scenarioTemplate)]},
    {"name": "examples", "symbols": ["examplesStatement", "dataTable"], "postprocess": 
        (data) => { return { type : 'Examples', examples : data[1] }; }
        },
    {"name": "examplesStatement", "symbols": ["_", "examplesKeyword", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "examplesKeyword", "symbols": [(lexer.has("examples") ? {type: "examples"} : examples)], "postprocess": data => data[0].type},
    {"name": "examplesKeyword", "symbols": [(lexer.has("scenarios") ? {type: "scenarios"} : scenarios)], "postprocess": data => data[0].type},
    {"name": "dataTable", "symbols": [], "postprocess": data => []},
    {"name": "dataTable", "symbols": ["dataTable", "dataTableRow"], "postprocess": (data) => { console.log('row',data[1]); return fp.concat(data[0],data[1]) }},
    {"name": "dataTableRow", "symbols": ["dataTableRow", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[0]},
    {"name": "steps", "symbols": ["given", "when", "then"], "postprocess": (data) => { return { given : data[0], when : data[1], then : data[2] } }},
    {"name": "given", "symbols": [], "postprocess": data => []},
    {"name": "given", "symbols": ["given", "_", (lexer.has("given") ? {type: "given"} : given), "_", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[0],{ text : data[4] })},
    {"name": "given", "symbols": ["given", "emptyLine"], "postprocess": id},
    {"name": "when", "symbols": [], "postprocess": data => []},
    {"name": "when", "symbols": ["when", "_", (lexer.has("when") ? {type: "when"} : when), "_", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[0],{ text : data[4] })},
    {"name": "when", "symbols": ["when", "emptyLine"], "postprocess": id},
    {"name": "then", "symbols": [], "postprocess": data => []},
    {"name": "then", "symbols": ["then", "_", (lexer.has("then") ? {type: "then"} : then), "_", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[0],{ text : data[4] })},
    {"name": "then", "symbols": ["then", "emptyLine"], "postprocess": id},
    {"name": "text", "symbols": [], "postprocess": data => ""},
    {"name": "text", "symbols": ["text", (lexer.has("word") ? {type: "word"} : word), "_"], "postprocess": data => data[0]+data[1]+data[2]},
    {"name": "freeform", "symbols": [], "postprocess": data => ""},
    {"name": "freeform", "symbols": ["freeform", "_", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[0] + data[2]},
    {"name": "_", "symbols": [], "postprocess": data => ""},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0].value},
    {"name": "newlines", "symbols": []},
    {"name": "newlines", "symbols": ["newlines", "_", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "emptyLine", "symbols": ["_", (lexer.has("newline") ? {type: "newline"} : newline)]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
