@{%
const fp = require('lodash/fp.js');
const moo = require('moo');
const log = require('./logger.js').log;
const lexer = moo.compile({
  emptyLine : { match: /^[ \t]*(?:\#[^\n]+)?\n/, lineBreaks : true },
  newline : { match : '\n', lineBreaks : true },
  ws : /[ \t]+/,
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
%}

@lexer lexer

main -> emptyLines feature {% data => data[1] %}

feature -> featureStatement freeform background statements {%
  (data) => fp.assign(data[0],{ description : data[1].trim(), background : data[2], statements : data[3] })
%}
featureStatement -> _ %feature _ %colon text %newline {%
  (data) => { return { type : { type : 'feature', name : data[1].value.trim() }, name : data[4].trim() } }
%}

background -> null {% data => null %}
  | backgroundStatement freeform steps {%
  data => fp.assign(data[0],{ description : data[1].trim(), steps : data[2] })
%}

backgroundStatement -> _ %background _ %colon text %newline {%
  (data) => { return { type : { type : 'background', name : data[1].value }, name : data[4].trim() } }
%}

statement -> example {% data => data[0] %}
  | scenarioOutline {% data => data[0] %}

statements -> null {% data => [] %}
  | statements statement {% data => fp.concat(data[0],data[1]) %}

example -> exampleStatement steps {% (data) => fp.assign(data[0],{ steps : data[1] }) %}
exampleStatement -> _ exampleKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'example', name : data[1] }, name : data[4].trim() } }
%}
exampleKeyword -> %example {% data => data[0].value %}

scenarioOutline -> scenarioOutlineStatement steps examplesList {%
  data => fp.assign(data[0],{ steps : data[1], examples : data[2] })
%}
scenarioOutlineStatement -> _ scenarioOutlineKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'scenarioOutline', name : data[1] }, name : data[4].trim() } }
%}
scenarioOutlineKeyword -> %scenarioOutline {% data => data[0].value %}

examplesList -> null {% data => [] %}
  | examplesList examples {% data => fp.concat(data[0],data[1]) %}

examples -> examplesStatement dataTable emptyLines {% data => fp.assign(data[0],{ dataTable : data[1] }) %}
examplesStatement -> _ examplesKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'examples', name : data[1] }, name : data[4] } }
%}
examplesKeyword -> %examples {% data => data[0].value %}

dataTable -> null {% data => [] %}
  | dataTable dataTableRow {% data => fp.concat(data[0],[data[1]]) %}

dataTableRow -> _ %pipe dataTableColumns %newline {% data => data[2] %}

dataTableColumns -> null {% data => [] %}
  | dataTableColumns text %pipe {% data => fp.concat(data[0],data[1].trim()) %}

steps -> stepAndTable moreSteps {% data => fp.concat(data[0],data[1]) %}

moreSteps -> null {% data => [] %}
  | moreSteps stepAndTable {% data => fp.concat(data[0],data[1]) %}
  | moreSteps %emptyLine {% data => data[0] %}

step -> _ stepKeyword text %newline {% data => { return { type : data[1], text : data[2].trim() } } %}
stepAndTable -> step dataTable {% data => fp.set('dataTable',data[1],data[0]) %}

stepKeyword -> %step {% (data) => { return { type : 'step', name : data[0].value } } %}

text -> null {% data => '' %}
  | text %word {% data => data[0]+data[1].value %}
  | text %ws {% data => data[0]+data[1].value %}
  | text %step {% data => data[0]+data[1].value %}
  | text %colon {% data => data[0]+data[1].value %}
  | text %example {% data => data[0]+data[1].value %}
  | text %examples {% data => data[0]+data[1].value %}
  | text %scenarioOutline {% data => data[0]+data[1].value %}
  | text %background {% data => data[0]+data[1].value %}

bolText -> %ws %word {% data => data[1].value %}
  | %word {% data => data[0].value %}

freeform -> null {% data => '' %}
  | freeform bolText text %newline {% (data) => {
  log.debug('freeform line: '+JSON.stringify([data[0],data[1],data[2]]));
  return data[0]+data[1]+data[2]+'\n'
}
%}
  | freeform %emptyLine {% data => data[0]+'\n' %}

_ -> null {% data => '' %}
  | %ws {% data => data[0].value %}

emptyLines -> null {% data => '' %}
  | emptyLines %emptyLine {% data => data[0]+'\n' %}
