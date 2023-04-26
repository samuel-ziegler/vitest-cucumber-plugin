@{%
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
%}

@lexer lexer

main -> expression %newline {% data => data[0] %}

expression -> tag {% data => data[0] %}
  | unaryOperation {% data => data[0] %}
  | binaryOperation {% data => data[0] %}
  | parenOperation {% data => data[0] %}

parenOperation -> %openParen _ expression _ %closeParen {% data => data[2] %}

unaryOperation -> %not %ws unaryExpression {% data => { return { operator : 'not', expression : data[2] } } %}

unaryExpression -> tag {% id %}
  | parenOperation {% id %}

binaryOperation -> expression _ binaryOperator _ expression {%
  data => { return { operator : data[2], left : data[0], right : data[4] } }
%}

binaryOperator -> %and {% data => data[0].value %}
  | %or {% data => data[0].value %}

tag -> %tag {% data => data[0].value.slice(1) %}

_ -> null
  | %ws

