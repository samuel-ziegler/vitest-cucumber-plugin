// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const fp = require('lodash/fp.js');
const moo = require('moo');
const log = require('./logger.js').log;
const lexer = moo.compile({
  newline : { match : '\n', lineBreaks : true },
  ws : /[ \t]+/,
  colon : ':',
  pipe : '|',
  backSlash : '\\',
  scenarioOutline : 'Scenario Outline',
  scenarioTemplate : 'Scenario Template',
  word : {
    match : /[^ \t\n:|\\]+/,
    type : moo.keywords({
      feature : 'Feature',
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
    {"name": "main", "symbols": ["feature"]},
    {"name": "feature", "symbols": ["featureStatement", "freeform", "statements"], "postprocess": 
        (data) => { return { name : data[0].trim(), description : data[1].trim(), statements : data[2] } }
        },
    {"name": "featureStatement", "symbols": ["_", (lexer.has("feature") ? {type: "feature"} : feature), "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[4]},
    {"name": "statements", "symbols": [], "postprocess": data => []},
    {"name": "statements", "symbols": ["statements", "example"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "statements", "symbols": ["statements", "scenarioOutline"]},
    {"name": "example", "symbols": ["exampleStatement", "steps"], "postprocess": (data) => { return { type : 'example', name : data[0], steps : data[1] } }},
    {"name": "exampleStatement", "symbols": ["_", "exampleKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[4]},
    {"name": "exampleKeyword", "symbols": [(lexer.has("example") ? {type: "example"} : example)]},
    {"name": "exampleKeyword", "symbols": [(lexer.has("scenario") ? {type: "scenario"} : scenario)]},
    {"name": "scenarioOutline", "symbols": ["scenarioOutlineStatement", "steps", "examples"]},
    {"name": "scenarioOutlineStatement", "symbols": ["_", "scenarioOutlineKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)]},
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioTemplate") ? {type: "scenarioTemplate"} : scenarioTemplate)]},
    {"name": "examples", "symbols": ["examplesStatement", "dataTable"]},
    {"name": "examplesStatement", "symbols": ["_", "examplesKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "examplesKeyword", "symbols": [(lexer.has("examples") ? {type: "examples"} : examples)]},
    {"name": "examplesKeyword", "symbols": [(lexer.has("scenarios") ? {type: "scenarios"} : scenarios)]},
    {"name": "dataTable", "symbols": []},
    {"name": "dataTable", "symbols": ["dataTable", "dataTableRow"]},
    {"name": "dataTableRow", "symbols": ["_", (lexer.has("pipe") ? {type: "pipe"} : pipe), "dataTableColumns", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "dataTableColumns", "symbols": []},
    {"name": "dataTableColumns", "symbols": ["dataTableColumns", "text", (lexer.has("pipe") ? {type: "pipe"} : pipe)]},
    {"name": "steps", "symbols": [], "postprocess": data => []},
    {"name": "steps", "symbols": ["steps", "step"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "step", "symbols": ["_", "stepKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => { return { type : data[1], step : data[2] } }},
    {"name": "stepKeyword", "symbols": [(lexer.has("given") ? {type: "given"} : given)], "postprocess": data => 'given'},
    {"name": "stepKeyword", "symbols": [(lexer.has("when") ? {type: "when"} : when)], "postprocess": data => 'when'},
    {"name": "stepKeyword", "symbols": [(lexer.has("then") ? {type: "then"} : then)], "postprocess": data => 'then'},
    {"name": "text", "symbols": [], "postprocess": data => ''},
    {"name": "text", "symbols": ["text", (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0]+data[1].value},
    {"name": "freeform", "symbols": [], "postprocess": data => ''},
    {"name": "freeform", "symbols": ["freeform", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess":  (data) => {
          log.debug('freeform line: '+JSON.stringify([data[0],data[1],data[2]]));
          return data[0]+data[1]+'\n'
        }
        },
    {"name": "_", "symbols": [], "postprocess": data => ''},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0].value}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
