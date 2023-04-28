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

	const fp = require$$0;
	const moo = require$$1;
	const lexer = moo.compile({
	  emptyLine : { match: /^[ \t]*(?:\#[^\n]+)?\n/, lineBreaks : true },
	  newline : { match : '\n', lineBreaks : true },
	  ws : /[ \t]+/,
	  at : '@',
	  colon : ':',
	  repeatStep : '*',
	  pipe : '|',
	  escapedPipe : '\\|',
	  escapedNewline : '\\n',
	  escapedBackSlash : '\\\\',
	  scenarioOutline : ['Scenario Outline','Scenario Template'],
	  docString : ['```','"""'],
	  word : {
	    match : /[^ \t\n\:\|\@\*]+/,
	    type : moo.keywords({
	      feature : 'Feature',
	      examples : ['Examples','Scenarios'],
	      given : 'Given',
	      when : 'When',
	      then : 'Then',
	      repeatStep : ['And','But'],
	      example : ['Example','Scenario'],
	      background : 'Background',
	      rule : 'Rule',
	    }),
	  },
	});

	const trimWhitespace = (cols,str) => {
	  const lines = str.split('\n').slice(0,-1);
	  return fp.reduce((s,line) => {
	    return s+line.slice(cols)+'\n'
	  },'')(lines);
	};

	const setRepeatStepTypesReducer = (steps,step) => {
	    if (!fp.has('type.type',step)) {
	        step = fp.set('type.type',fp.last(steps).type.type,step);
	    }
	    return fp.concat(steps,step);
	};

	const setRepeatStepTypes = (steps) => fp.reduce(setRepeatStepTypesReducer,[],steps);

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
	    {"name": "statement", "symbols": ["rule"], "postprocess": data => data[0]},
	    {"name": "statements", "symbols": [], "postprocess": data => []},
	    {"name": "statements", "symbols": ["statements", "statement"], "postprocess": data => fp.concat(data[0],data[1])},
	    {"name": "example", "symbols": ["tags", "exampleStatement", "steps"], "postprocess": (data) => fp.assign(data[1],{ tags : data[0], steps : data[2] })},
	    {"name": "exampleStatement", "symbols": ["_", "exampleKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
	        (data) => { return { type : { type : 'example', name : data[1] }, name : data[4].trim() } }
	        },
	    {"name": "exampleKeyword", "symbols": [(lexer.has("example") ? {type: "example"} : example)], "postprocess": data => data[0].value},
	    {"name": "exampleList", "symbols": [], "postprocess": data => []},
	    {"name": "exampleList", "symbols": ["exampleList", "example"], "postprocess": data => fp.concat(data[0],data[1])},
	    {"name": "scenarioOutline", "symbols": ["tags", "scenarioOutlineStatement", "steps", "examplesList"], "postprocess": 
	        data => fp.assign(data[1],{ tags : data[0], steps : data[2], examples : data[3] })
	        },
	    {"name": "scenarioOutlineStatement", "symbols": ["_", "scenarioOutlineKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
	        (data) => { return { type : { type : 'scenarioOutline', name : data[1] }, name : data[4].trim() } }
	        },
	    {"name": "scenarioOutlineKeyword", "symbols": [(lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)], "postprocess": data => data[0].value},
	    {"name": "rule", "symbols": ["tags", "ruleStatement", "example", "exampleList"], "postprocess": 
	        data => fp.assign(data[1],{ tags : data[0], examples : fp.concat(data[2],data[3]) })
	        },
	    {"name": "ruleStatement", "symbols": ["_", "ruleKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
	        (data) => { return { type : { type : 'rule', name : data[1] }, name : data[4].trim() } }
	        },
	    {"name": "ruleKeyword", "symbols": [(lexer.has("rule") ? {type: "rule"} : rule)], "postprocess": data => data[0].value},
	    {"name": "examplesList", "symbols": [], "postprocess": data => []},
	    {"name": "examplesList", "symbols": ["examplesList", "examples"], "postprocess": data => fp.concat(data[0],data[1])},
	    {"name": "examples", "symbols": ["tags", "examplesStatement", "dataTable", "emptyLines"], "postprocess": 
	        data => fp.assign(data[1],{ tags : data[0], dataTable : data[2] })
	        },
	    {"name": "examplesStatement", "symbols": ["_", "examplesKeyword", "_", (lexer.has("colon") ? {type: "colon"} : colon), "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
	        (data) => { return { type : { type : 'examples', name : data[1] }, name : data[4] } }
	        },
	    {"name": "examplesKeyword", "symbols": [(lexer.has("examples") ? {type: "examples"} : examples)], "postprocess": data => data[0].value},
	    {"name": "dataTable", "symbols": ["dataTableRow"], "postprocess": data => [data[0]]},
	    {"name": "dataTable", "symbols": ["dataTable", "dataTableRow"], "postprocess": data => fp.concat(data[0],[data[1]])},
	    {"name": "dataTableRow", "symbols": ["_", (lexer.has("pipe") ? {type: "pipe"} : pipe), "dataTableColumns", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[2]},
	    {"name": "dataTableColumns", "symbols": [], "postprocess": data => []},
	    {"name": "dataTableColumns", "symbols": ["dataTableColumns", "dataTableColumnText", (lexer.has("pipe") ? {type: "pipe"} : pipe)], "postprocess": data => fp.concat(data[0],data[1].trim())},
	    {"name": "dataTableColumnText", "symbols": [], "postprocess": data => ''},
	    {"name": "dataTableColumnText", "symbols": ["dataTableColumnText", "escapedColumnCharaters"], "postprocess": data => data[0]+data[1]},
	    {"name": "dataTableColumnText", "symbols": ["dataTableColumnText", "keywords"], "postprocess": data => data[0]+data[1]},
	    {"name": "dataTableColumnText", "symbols": ["dataTableColumnText", (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0]+data[1].value},
	    {"name": "dataTableColumnText", "symbols": ["dataTableColumnText", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0]+data[1].value},
	    {"name": "escapedColumnCharaters", "symbols": [(lexer.has("escapedPipe") ? {type: "escapedPipe"} : escapedPipe)], "postprocess": data => '|'},
	    {"name": "escapedColumnCharaters", "symbols": [(lexer.has("escapedBackSlash") ? {type: "escapedBackSlash"} : escapedBackSlash)], "postprocess": data => '\\'},
	    {"name": "escapedColumnCharaters", "symbols": [(lexer.has("escapedNewline") ? {type: "escapedNewline"} : escapedNewline)], "postprocess": data => '\n'},
	    {"name": "steps", "symbols": ["step", "moreSteps"], "postprocess": data => setRepeatStepTypes(fp.concat(data[0],data[1]))},
	    {"name": "moreSteps", "symbols": [], "postprocess": data => []},
	    {"name": "moreSteps", "symbols": ["moreSteps", "step"], "postprocess": data => fp.concat(data[0],data[1])},
	    {"name": "moreSteps", "symbols": ["moreSteps", "repeatStep"], "postprocess": data => fp.concat(data[0],data[1])},
	    {"name": "moreSteps", "symbols": ["moreSteps", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]},
	    {"name": "step", "symbols": ["stepStatement"]},
	    {"name": "step", "symbols": ["stepStatement", "dataTable"], "postprocess": data => fp.set('dataTable',data[1],data[0])},
	    {"name": "step", "symbols": ["stepStatement", "docString"], "postprocess": data => fp.set('docString',data[1],data[0])},
	    {"name": "stepStatement", "symbols": ["_", "stepKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => { return { type : data[1], text : data[2].trim() } }},
	    {"name": "stepKeyword", "symbols": [(lexer.has("given") ? {type: "given"} : given)], "postprocess": (data) => { return { type : 'given', name : data[0].value } }},
	    {"name": "stepKeyword", "symbols": [(lexer.has("when") ? {type: "when"} : when)], "postprocess": (data) => { return { type : 'when', name : data[0].value } }},
	    {"name": "stepKeyword", "symbols": [(lexer.has("then") ? {type: "then"} : then)], "postprocess": (data) => { return { type : 'then', name : data[0].value } }},
	    {"name": "repeatStep", "symbols": ["repeatStepStatement"]},
	    {"name": "repeatStep", "symbols": ["repeatStepStatement", "dataTable"], "postprocess": data => fp.set('dataTable',data[1],data[0])},
	    {"name": "repeatStep", "symbols": ["repeatStepStatement", "docString"], "postprocess": data => fp.set('docString',data[1],data[0])},
	    {"name": "repeatStepStatement", "symbols": ["_", "repeatStepKeyword", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
	        data => { return { type : data[1], text : data[2].trim() } }
	        },
	    {"name": "repeatStepKeyword", "symbols": [(lexer.has("repeatStep") ? {type: "repeatStep"} : repeatStep)], "postprocess": (data) => { return { name : data[0].value } }},
	    {"name": "text", "symbols": [], "postprocess": data => ''},
	    {"name": "text", "symbols": ["text", (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0]+data[1].value},
	    {"name": "text", "symbols": ["text", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0]+data[1].value},
	    {"name": "text", "symbols": ["text", "keywords"], "postprocess": data => data[0]+data[1]},
	    {"name": "text", "symbols": ["text", (lexer.has("pipe") ? {type: "pipe"} : pipe)], "postprocess": data => data[0]+data[1].value},
	    {"name": "text", "symbols": ["text", (lexer.has("escapedPipe") ? {type: "escapedPipe"} : escapedPipe)], "postprocess": data => data[0]+data[1].value},
	    {"name": "text", "symbols": ["text", (lexer.has("escapedNewline") ? {type: "escapedNewline"} : escapedNewline)], "postprocess": data => data[0]+data[1].value},
	    {"name": "text", "symbols": ["text", (lexer.has("escapedBackSlash") ? {type: "escapedBackSlash"} : escapedBackSlash)], "postprocess": data => data[0]+data[1].value},
	    {"name": "keywords", "symbols": [(lexer.has("given") ? {type: "given"} : given)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("when") ? {type: "when"} : when)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("then") ? {type: "then"} : then)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("repeatStep") ? {type: "repeatStep"} : repeatStep)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("example") ? {type: "example"} : example)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("examples") ? {type: "examples"} : examples)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("scenarioOutline") ? {type: "scenarioOutline"} : scenarioOutline)], "postprocess": data => data[0].value},
	    {"name": "keywords", "symbols": [(lexer.has("background") ? {type: "background"} : background)], "postprocess": data => data[0].value},
	    {"name": "bolText", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[1].value},
	    {"name": "bolText", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0].value},
	    {"name": "freeform", "symbols": [], "postprocess": data => ''},
	    {"name": "freeform", "symbols": ["freeform", "bolText", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess":  (data) => {
	          return data[0]+data[1]+data[2]+'\n'
	        }
	        },
	    {"name": "freeform", "symbols": ["freeform", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]+'\n'},
	    {"name": "docString", "symbols": ["docStringStatement", "docText", "docStringStatement"], "postprocess": 
	        data => fp.set('text',trimWhitespace(data[0].ws.length,data[1]),data[0])
	        },
	    {"name": "docStringStatement", "symbols": ["_", (lexer.has("docString") ? {type: "docString"} : docString), "contentType", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": 
	        (data) => { return { type : { type : 'docString', name : data[1].value }, ws : data[0], contentType : data[2] } }
	        },
	    {"name": "contentType", "symbols": [], "postprocess": data => null},
	    {"name": "contentType", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => null},
	    {"name": "contentType", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": data => data[0].value},
	    {"name": "docText", "symbols": [], "postprocess": data => ''},
	    {"name": "docText", "symbols": ["docText", "text", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[0]+data[1]+data[2].value},
	    {"name": "docText", "symbols": ["docText", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]+data[1].value},
	    {"name": "_", "symbols": [], "postprocess": data => ''},
	    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": data => data[0].value},
	    {"name": "emptyLines", "symbols": [], "postprocess": data => ''},
	    {"name": "emptyLines", "symbols": ["emptyLines", (lexer.has("emptyLine") ? {type: "emptyLine"} : emptyLine)], "postprocess": data => data[0]+'\n'}
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
