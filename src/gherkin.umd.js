// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const fp = require('lodash/fp.js');
const moo = require('moo');
const log = require('./logger.js').log;
const lexer = moo.compile({
  emptyLine : { match: /^[ \t]*(?:\#[^\n]+)?\n/, lineBreaks : true },
  newline : { match : '\n', lineBreaks : true },
  ws : /[ \t]+/,
  at : '@',
  colon : ':',
  step : '*',
  pipe : '|',
  backSlash : '\\',
  scenarioOutline : ['Scenario Outline','Scenario Template'],
  word : {
    match : /[^ \t\n:|\\]+/,
    type : moo.keywords({
      feature : 'Feature',
      examples : ['Examples','Scenarios'],
      step : ['Given','When','Then','And','But'],
      example : ['Example','Scenario'],
      background : 'Background',
    }),
  },
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["emptyLines", "tags", "feature"], "postprocess": data => fp.set('tags',data[1],data[2])},
    {"name": "feature", "symbols": ["featureStatement", "freeform", "background", "statements"], "postprocess": 
        (data) => fp.assign(data[0],{ description : data[1].trim(), background : data[2], statements : data[3] })
        },
    {"name": "featureStatement", "symbols": ["_", (lexer.has("feature") ? {type: "feature"} : feature), "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'feature', name : data[1].value.trim() }, name : data[4].trim() } }
        },
    {"name": "tags", "symbols": [], "postprocess": data => []},
    {"name": "tags", "symbols": ["_", "tag", "tagList", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => fp.concat(data[1],data[2])},
    {"name": "tagList", "symbols": [], "postprocess": data => []},
    {"name": "tagList", "symbols": ["tagList", (lexer.has("ws") ? {type: "ws"} : ws), "tag"], "postprocess": data => fp.concat(data[0],data[2])},
    {"name": "tag", "symbols": [(lexer.has("at") ? {type: "at"} : at), (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[1].value.trim()},
    {"name": "background", "symbols": [], "postprocess": data => null},
    {"name": "background", "symbols": ["backgroundStatement", "freeform", "steps"], "postprocess": 
        data => fp.assign(data[0],{ description : data[1].trim(), steps : data[2] })
        },
    {"name": "backgroundStatement", "symbols": ["_", (lexer.has("background") ? {type: "background"} : background), "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'background', name : data[1].value }, name : data[4].trim() } }
        },
    {"name": "statement", "symbols": ["example"], "postprocess": data => data[0]},
    {"name": "statement", "symbols": ["scenarioOutline"], "postprocess": data => data[0]},
    {"name": "statements", "symbols": [], "postprocess": data => []},
    {"name": "statements", "symbols": ["statements", "statement"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "example", "symbols": ["tags", "exampleStatement", "steps"], "postprocess": (data) => fp.assign(data[1],{ tags : data[0], steps : data[2] })},
    {"name": "exampleStatement", "symbols": ["_", "exampleKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'example', name : data[1] }, name : data[4].trim() } }
        },
    {"name": "exampleKeyword", "symbols": [(lexer.has("example") ? {type: "example"} : example)], "postprocess": data => data[0].value},
    {"name": "scenarioOutline", "symbols": ["tags", "scenarioOutlineStatement", "steps", "examplesList"], "postprocess": 
        data => fp.assign(data[1],{ tags : data[0], steps : data[2], examples : data[3] })
        },
    {"name": "scenarioOutlineStatement", "symbols": ["_", "scenarioOutlineKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'scenarioOutline', name : data[1] }, name : data[4].trim() } }
        },
    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)], "postprocess": data => data[0].value},
    {"name": "examplesList", "symbols": [], "postprocess": data => []},
    {"name": "examplesList", "symbols": ["examplesList", "examples"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "examples", "symbols": ["tags", "examplesStatement", "dataTable", "emptyLines"], "postprocess": 
        data => fp.assign(data[1],{ tags : data[0], dataTable : data[2] })
        },
    {"name": "examplesStatement", "symbols": ["_", "examplesKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
        (data) => { return { type : { type : 'examples', name : data[1] }, name : data[4] } }
        },
    {"name": "examplesKeyword", "symbols": [(lexer.has("examples") ? {type: "examples"} : examples)], "postprocess": data => data[0].value},
    {"name": "dataTable", "symbols": [], "postprocess": data => []},
    {"name": "dataTable", "symbols": ["dataTable", "dataTableRow"], "postprocess": data => fp.concat(data[0],[data[1]])},
    {"name": "dataTableRow", "symbols": ["_", (lexer.has("pipe") ? {type: "pipe"} : pipe), "dataTableColumns", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[2]},
    {"name": "dataTableColumns", "symbols": [], "postprocess": data => []},
    {"name": "dataTableColumns", "symbols": ["dataTableColumns", "text", (lexer.has("pipe") ? {type: "pipe"} : pipe)], "postprocess": data => fp.concat(data[0],data[1].trim())},
    {"name": "steps", "symbols": ["stepAndTable", "moreSteps"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "moreSteps", "symbols": [], "postprocess": data => []},
    {"name": "moreSteps", "symbols": ["moreSteps", "stepAndTable"], "postprocess": data => fp.concat(data[0],data[1])},
    {"name": "moreSteps", "symbols": ["moreSteps", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]},
    {"name": "step", "symbols": ["_", "stepKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => { return { type : data[1], text : data[2].trim() } }},
    {"name": "stepAndTable", "symbols": ["step", "dataTable"], "postprocess": data => fp.set('dataTable',data[1],data[0])},
    {"name": "stepKeyword", "symbols": [(lexer.has("step") ? {type: "step"} : step)], "postprocess": (data) => { return { type : 'step', name : data[0].value } }},
    {"name": "text", "symbols": [], "postprocess": data => ''},
    {"name": "text", "symbols": ["text", (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("step") ? {type: "step"} : step)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("colon") ? {type: "colon"} : colon)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("example") ? {type: "example"} : example)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("examples") ? {type: "examples"} : examples)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)], "postprocess": data => data[0]+data[1].value},
    {"name": "text", "symbols": ["text", (lexer.has("background") ? {type: "background"} : background)], "postprocess": data => data[0]+data[1].value},
    {"name": "bolText", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[1].value},
    {"name": "bolText", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0].value},
    {"name": "freeform", "symbols": [], "postprocess": data => ''},
    {"name": "freeform", "symbols": ["freeform", "bolText", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess":  (data) => {
          return data[0]+data[1]+data[2]+'\n'
        }
        },
    {"name": "freeform", "symbols": ["freeform", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]+'\n'},
    {"name": "_", "symbols": [], "postprocess": data => ''},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0].value},
    {"name": "emptyLines", "symbols": [], "postprocess": data => ''},
    {"name": "emptyLines", "symbols": ["emptyLines", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]+'\n'}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
