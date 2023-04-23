@{%
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
%}

@lexer lexer

main -> feature {% id %}

feature -> featureStatement freeform statements {%
  (data) => { return { type : 'feature', name : data[0], description : data[1], statements : data[2] } }
%}
featureStatement -> _ %feature _ %colon _ featureName %newline {%
  data => data[5]
%}
featureName -> text {% data => data[0] %}

statements -> null {% data => [] %}
  | statements example {% data => fp.concat(data[0],data[1]) %}
  | statements scenarioOutline {% data => fp.concat(data[0],data[1]) %}
  | statements emptyLine {% data => data[0] %}

example -> exampleStatement steps {%
  (data) => { return { type : 'example', name : data[0], steps : data[1] } }
%}
exampleStatement -> _ exampleKeyword _ %colon _ text %newline {% data => data[5] %}
exampleKeyword -> %example | %scenario

scenarioOutline -> scenarioStatement steps examples {%
  (data) => { return { type : 'scenarioOutline', name : data[0], steps : data[1], examples : data[2] } }
%}
scenarioStatement -> _ scenarioOutlineKeyword text %newline {% data => data[2] %}
scenarioOutlineKeyword -> %scenarioOutline | %scenarioTemplate

examples -> examplesStatement dataTable {%
  (data) => { return { type : 'Examples', examples : data[1] }; }
%}
examplesStatement -> _ examplesKeyword %newline
examplesKeyword -> %examples {% data => data[0].type %}
  | %scenarios {% data => data[0].type %}

dataTable -> null {% data => [] %}
   | dataTable dataTableRow {% (data) => { console.log('row',data[1]); return fp.concat(data[0],data[1]) } %}

dataTableRow -> dataTableRow %newline {% data => data[0] %}

steps -> given when then {% (data) => { return { given : data[0], when : data[1], then : data[2] } } %}

given -> null {% data => [] %}
  | given _ %given _ text %newline {% data => fp.concat(data[0],{ text : data[4] }) %}
  | given emptyLine {% id %}

when -> null {% data => [] %}
  | when _ %when _ text %newline {% data => fp.concat(data[0],{ text : data[4] }) %}
  | when emptyLine {% id %}

then -> null {% data => [] %}
  | then _ %then _ text %newline {% data => fp.concat(data[0],{ text : data[4] }) %}
  | then emptyLine {% id %}

text -> null {% data => "" %}
  | text %word _ {% data => data[0]+data[1]+data[2] %}

freeform -> null {% data => "" %}
  | freeform _ text %newline {% data => data[0] + data[2] %}

_ -> null {% data => "" %}
  | %ws {% data => data[0].value %}

newlines -> null
  | newlines _ %newline

emptyLine -> _ %newline
