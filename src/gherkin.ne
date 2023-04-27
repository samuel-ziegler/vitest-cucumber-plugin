@{%
const fp = require('lodash/fp.js');
const moo = require('moo');
const lexer = moo.compile({
  emptyLine : { match: /^[ \t]*(?:\#[^\n]+)?\n/, lineBreaks : true },
  newline : { match : '\n', lineBreaks : true },
  ws : /[ \t]+/,
  at : '@',
  colon : ':',
  step : '*',
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
      step : ['Given','When','Then','And','But'],
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
%}

@lexer lexer

main -> emptyLines tags feature {% data => fp.set('tags',data[1],data[2]) %}

feature -> featureStatement freeform background statements {%
  (data) => fp.assign(data[0],{ description : data[1].trim(), background : data[2], statements : data[3] })
%}
featureStatement -> _ %feature _ %colon text %newline {%
  (data) => { return { type : { type : 'feature', name : data[1].value.trim() }, name : data[4].trim() } }
%}

tags -> null {% data => [] %}
  | _ tag tagList %newline {% data => fp.concat(data[1],data[2]) %}

tagList -> null {% data => [] %}
  | tagList %ws tag {% data => fp.concat(data[0],data[2]) %}

tag -> %at %word {% data => data[1].value.trim() %}

background -> null {% data => null %}
  | backgroundStatement freeform steps {%
  data => fp.assign(data[0],{ description : data[1].trim(), steps : data[2] })
%}

backgroundStatement -> _ %background _ %colon text %newline {%
  (data) => { return { type : { type : 'background', name : data[1].value }, name : data[4].trim() } }
%}

statement -> example {% data => data[0] %}
  | scenarioOutline {% data => data[0] %}
  | rule {% data => data[0] %}

statements -> null {% data => [] %}
  | statements statement {% data => fp.concat(data[0],data[1]) %}

example -> tags exampleStatement steps {% (data) => fp.assign(data[1],{ tags : data[0], steps : data[2] }) %}
exampleStatement -> _ exampleKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'example', name : data[1] }, name : data[4].trim() } }
%}
exampleKeyword -> %example {% data => data[0].value %}

exampleList -> null {% data => [] %}
  | exampleList example {% data => fp.concat(data[0],data[1]) %}

scenarioOutline -> tags scenarioOutlineStatement steps examplesList {%
  data => fp.assign(data[1],{ tags : data[0], steps : data[2], examples : data[3] })
%}
scenarioOutlineStatement -> _ scenarioOutlineKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'scenarioOutline', name : data[1] }, name : data[4].trim() } }
%}
scenarioOutlineKeyword -> %scenarioOutline {% data => data[0].value %}

rule -> tags ruleStatement example exampleList {%
  data => fp.assign(data[1],{ tags : data[0], examples : fp.concat(data[2],data[3]) })
%}
ruleStatement -> _ ruleKeyword  _ %colon text %newline {%
  (data) => { return { type : { type : 'rule', name : data[1] }, name : data[4].trim() } }
%}
ruleKeyword -> %rule {% data => data[0].value %}

examplesList -> null {% data => [] %}
  | examplesList examples {% data => fp.concat(data[0],data[1]) %}

examples -> tags examplesStatement dataTable emptyLines {%
  data => fp.assign(data[1],{ tags : data[0], dataTable : data[2] })
%}
examplesStatement -> _ examplesKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'examples', name : data[1] }, name : data[4] } }
%}
examplesKeyword -> %examples {% data => data[0].value %}

dataTable -> dataTableRow {% data => [data[0]] %}
  | dataTable dataTableRow {% data => fp.concat(data[0],[data[1]]) %}

dataTableRow -> _ %pipe dataTableColumns %newline {% data => data[2] %}

dataTableColumns -> null {% data => [] %}
  | dataTableColumns dataTableColumnText %pipe {% data => fp.concat(data[0],data[1].trim()) %}

dataTableColumnText -> null {% data => '' %}
  | dataTableColumnText escapedColumnCharaters {% data => data[0]+data[1] %}
  | dataTableColumnText keywords {% data => data[0]+data[1] %}
  | dataTableColumnText %word {% data => data[0]+data[1].value %}
  | dataTableColumnText %ws {% data => data[0]+data[1].value %}

escapedColumnCharaters -> %escapedPipe {% data => '|' %}
  | %escapedBackSlash {% data => '\\' %}
  | %escapedNewline {% data => '\n' %}

steps -> step moreSteps {% data => fp.concat(data[0],data[1]) %}

moreSteps -> null {% data => [] %}
  | moreSteps step {% data => fp.concat(data[0],data[1]) %}
  | moreSteps %emptyLine {% data => data[0] %}

step -> stepStatement
  | stepStatement dataTable {% data => fp.set('dataTable',data[1],data[0]) %}
  | stepStatement docString {% data => fp.set('docString',data[1],data[0]) %}

stepStatement -> _ stepKeyword text %newline {% data => { return { type : data[1], text : data[2].trim() } } %}

stepKeyword -> %step {% (data) => { return { type : 'step', name : data[0].value } } %}

text -> null {% data => '' %}
  | text %word {% data => data[0]+data[1].value %}
  | text %ws {% data => data[0]+data[1].value %}
  | text keywords {% data => data[0]+data[1] %}
  | text %pipe {% data => data[0]+data[1].value %}
  | text %escapedPipe {% data => data[0]+data[1].value %}
  | text %escapedNewline {% data => data[0]+data[1].value %}
  | text %escapedBackSlash {% data => data[0]+data[1].value %}

keywords -> %step {% data => data[0].value %}
  | %colon {% data => data[0].value %}
  | %example {% data => data[0].value %}
  | %examples {% data => data[0].value %}
  | %scenarioOutline {% data => data[0].value %}
  | %background {% data => data[0].value %}

bolText -> %ws %word {% data => data[1].value %}
  | %word {% data => data[0].value %}

freeform -> null {% data => '' %}
  | freeform bolText text %newline {% (data) => {
  return data[0]+data[1]+data[2]+'\n'
}
%}
  | freeform %emptyLine {% data => data[0]+'\n' %}

docString -> docStringStatement docText docStringStatement {%
  data => fp.set('text',trimWhitespace(data[0].ws.length,data[1]),data[0])
%}
docStringStatement -> _ %docString contentType %newline {%
  (data) => { return { type : { type : 'docString', name : data[1].value }, ws : data[0], contentType : data[2] } }
%}

contentType -> null {% data => null %}
  | %ws {% data => null %}
  | %word {% data => data[0].value %}

docText -> null {% data => '' %}
  | docText text %newline {% data => data[0]+data[1]+data[2].value %}

_ -> null {% data => '' %}
  | %ws {% data => data[0].value %}

emptyLines -> null {% data => '' %}
  | emptyLines %emptyLine {% data => data[0]+'\n' %}
