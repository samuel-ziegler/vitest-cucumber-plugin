// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const fp = require('lodash/fp.js');
const moo = require('moo');
const lexer = moo.compile({
  and : 'and',
  or : 'or',
  not : 'not',
  openParen : '(',
  closeParen : ')',
  newline : { match : '\n', lineBreaks : true },
  ws : /[ \t]+/,
  tag : /\@[\w\.]+/,
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["expression", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": data => data[0]},
    {"name": "expression", "symbols": ["tag"], "postprocess": data => data[0]},
    {"name": "expression", "symbols": ["unaryOperation"], "postprocess": data => data[0]},
    {"name": "expression", "symbols": ["binaryOperation"], "postprocess": data => data[0]},
    {"name": "expression", "symbols": ["parenOperation"], "postprocess": data => data[0]},
    {"name": "parenOperation", "symbols": [(lexer.has("openParen") ? {type: "openParen"} : openParen), "_", "expression", "_", (lexer.has("closeParen") ? {type: "closeParen"} : closeParen)], "postprocess": data => data[2]},
    {"name": "unaryOperation", "symbols": [(lexer.has("not") ? {type: "not"} : not), (lexer.has("ws") ? {type: "ws"} : ws), "unaryExpression"], "postprocess": data => { return { operator : 'not', expression : data[2] } }},
    {"name": "unaryExpression", "symbols": ["tag"], "postprocess": id},
    {"name": "unaryExpression", "symbols": ["parenOperation"], "postprocess": id},
    {"name": "binaryOperation", "symbols": ["expression", "_", "binaryOperator", "_", "expression"], "postprocess": 
        data => { return { operator : data[2], left : data[0], right : data[4] } }
        },
    {"name": "binaryOperator", "symbols": [(lexer.has("and") ? {type: "and"} : and)], "postprocess": data => data[0].value},
    {"name": "binaryOperator", "symbols": [(lexer.has("or") ? {type: "or"} : or)], "postprocess": data => data[0].value},
    {"name": "tag", "symbols": [(lexer.has("tag") ? {type: "tag"} : tag)], "postprocess": data => data[0].value.slice(1)},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
