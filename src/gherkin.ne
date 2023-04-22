@{%
const fp = require('lodash/fp.js');
const moo = require('moo');
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
%}

@lexer lexer

main -> feature {% id %}

feature -> %feature text %newline freeform %newline statements {%
  (data) => { return { name : data[1], description : data[3], statements : data[5] } }
%}

statements -> null {% data => [] %}
  | statements _ exampleKeyword text %newline steps {%
  (data) => { return fp.concat(data[0],{ type : data[2], name : data[3], steps : data[5] }) }
%}
  | statements _ %newline {% id %}

exampleKeyword -> %example | %scenario {% data => data[0].type %}

steps -> given when then {% (data) => { return { given : data[0], when : data[1], then : data[2] } } %}

given -> null {% data => [] %}
  | given _ %given text %newline {% data => fp.concat(data[0],{ text : data[3] }) %}

when -> null {% data => [] %}
  | when _ %when text %newline {% data => fp.concat(data[0],{ text : data[3] }) %}

then -> null {% data => [] %}
  | then _ %then text %newline {% data => fp.concat(data[0],{ text : data[3] }) %}

text -> _ %text {% data => data[1].value %}

freeform -> null {% data => "" %}
  | freeform text %newline {% data => data[0] + data[1] + data[2] %}

_ -> null | %ws {% data => null %}
