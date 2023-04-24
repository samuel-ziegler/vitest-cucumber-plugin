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
    {"name": "main", "symbols": ["feature"], "postprocess": id},
    {"name": "feature", "symbols": ["featureStatement", "freeform", "statements"], "postprocess": 
        (data) => fp.assign(data[0],{ description : data[1].trim(), statements : data[2] })
        },
    {"name": "featureStatement", "symbols": ["_", (lexer.has("feature") ? {type: "feature"} : feature), "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'feature', name : data[1].value.trim() }, name : data[4].trim() } }
        },
    {"name": "statements", "symbols": [], "postprocess": data => []},
    {"name": "statements", "symbols": ["statements", "example"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "statements", "symbols": ["statements", "scenarioOutline"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "example", "symbols": ["exampleStatement", "steps"], "postprocess": (data) => fp.assign(data[0],{ steps : data[1] })},
    {"name": "exampleStatement", "symbols": ["_", "exampleKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'example', name : data[1] }, name : data[4].trim() } }
        },
    {"name": "exampleKeyword", "symbols": [(lexer.has("example") ? {type: "example"} : example)], "postprocess": data => data[0].value},
    {"name": "exampleKeyword", "symbols": [(lexer.has("scenario") ? {type: "scenario"} : scenario)], "postprocess": data => data[0].value},
    {"name": "scenarioOutline", "symbols": ["scenarioOutlineStatement", "steps", "examplesList"], "postprocess": 
        data => fp.assign(data[0],{ steps : data[1], examples : data[2] })
        },
    {"name": "scenarioOutlineStatement", "symbols": ["_", "scenarioOutlineKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'scenarioOutline', name : data[1] }, name : data[4].trim() } }
        },
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)], "postprocess": data => data[0].value},
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioTemplate") ? {type: "scenarioTemplate"} : scenarioTemplate)], "postprocess": data => data[0].value},
    {"name": "examplesList", "symbols": [], "postprocess": data => []},
    {"name": "examplesList", "symbols": ["examplesList", "examples"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "examples", "symbols": ["examplesStatement", "dataTable"], "postprocess": data => fp.assign(data[0],{ dataTable : data[1] })},
    {"name": "examplesStatement", "symbols": ["_", "examplesKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'examples', name : data[1] }, name : data[4] } }
        },
    {"name": "examplesKeyword", "symbols": [(lexer.has("examples") ? {type: "examples"} : examples)], "postprocess": data => data[0].value},
    {"name": "examplesKeyword", "symbols": [(lexer.has("scenarios") ? {type: "scenarios"} : scenarios)], "postprocess": data => data[0].value},
    {"name": "dataTable", "symbols": [], "postprocess": data => []},
    {"name": "dataTable", "symbols": ["dataTable", "dataTableRow"], "postprocess": data => fp.concat(data[0],[data[1]])},
    {"name": "dataTableRow", "symbols": ["_", (lexer.has("pipe") ? {type: "pipe"} : pipe), "dataTableColumns", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[2]},
    {"name": "dataTableColumns", "symbols": [], "postprocess": data => []},
    {"name": "dataTableColumns", "symbols": ["dataTableColumns", "text", (lexer.has("pipe") ? {type: "pipe"} : pipe)], "postprocess": data => fp.concat(data[0],data[1].trim())},
    {"name": "steps", "symbols": [], "postprocess": data => []},
    {"name": "steps", "symbols": ["steps", "step", "dataTable"], "postprocess": 
        (data) => { const step = fp.set('dataTable',data[2],data[1]); return fp.concat(data[0],step) }
        },
    {"name": "steps", "symbols": ["steps", "_", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[0]},
    {"name": "step", "symbols": ["_", "stepKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => { return { type : data[1], text : data[2].trim() } }},
    {"name": "stepKeyword", "symbols": [(lexer.has("given") ? {type: "given"} : given)], "postprocess": (data) => { return { type : 'given', name : data[0].value } }},
    {"name": "stepKeyword", "symbols": [(lexer.has("when") ? {type: "when"} : when)], "postprocess": (data) => { return { type : 'when', name : data[0].value } }},
    {"name": "stepKeyword", "symbols": [(lexer.has("then") ? {type: "then"} : then)], "postprocess": (data) => { return { type : 'then', name : data[0].value } }},
    {"name": "text", "symbols": [], "postprocess": data => ''},
    {"name": "text", "symbols": ["text", (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("given") ? {type: "given"} : given)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("when") ? {type: "when"} : when)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("then") ? {type: "then"} : then)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("colon") ? {type: "colon"} : colon)], "postprocess": data => data[0]+data[1].value},
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
