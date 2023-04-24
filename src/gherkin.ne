@{%
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
%}

@lexer lexer

main -> feature {% id %}

feature -> featureStatement freeform statements {%
  (data) => fp.assign(data[0],{ description : data[1].trim(), statements : data[2] })
%}
featureStatement -> _ %feature _ %colon text %newline {%
  (data) => { return { type : { type : 'feature', name : data[1].value.trim() }, name : data[4].trim() } }
%}

statements -> null {% data => [] %}
  | statements example {% data => fp.concat(data[0],data[1]) %}
  | statements scenarioOutline {% data => fp.concat(data[0],data[1]) %}

example -> exampleStatement steps {% (data) => fp.assign(data[0],{ steps : data[1] }) %}
exampleStatement -> _ exampleKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'example', name : data[1] }, name : data[4].trim() } }
%}
exampleKeyword -> %example {% data => data[0].value %}
  | %scenario {% data => data[0].value %}

scenarioOutline -> scenarioOutlineStatement steps examplesList {%
  data => fp.assign(data[0],{ steps : data[1], examples : data[2] })
%}
scenarioOutlineStatement -> _ scenarioOutlineKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'scenarioOutline', name : data[1] }, name : data[4].trim() } }
%}
scenarioOutlineKeyword -> %scenarioOutline {% data => data[0].value %}
  | %scenarioTemplate {% data => data[0].value %}

examplesList -> null {% data => [] %}
  | examplesList examples {% data => fp.concat(data[0],data[1]) %}

examples -> examplesStatement dataTable {% data => fp.assign(data[0],{ dataTable : data[1] }) %}
examplesStatement -> _ examplesKeyword _ %colon text %newline {%
  (data) => { return { type : { type : 'examples', name : data[1] }, name : data[4] } }
%}
examplesKeyword -> %examples {% data => data[0].value %}
  | %scenarios {% data => data[0].value %}

dataTable -> null {% data => [] %}
  | dataTable dataTableRow {% data => fp.concat(data[0],[data[1]]) %}

dataTableRow -> _ %pipe dataTableColumns %newline {% data => data[2] %}

dataTableColumns -> null {% data => [] %}
  | dataTableColumns text %pipe {% data => fp.concat(data[0],data[1].trim()) %}

steps -> null {% data => [] %}
  | steps step dataTable {%
  (data) => { const step = fp.set('dataTable',data[2],data[1]); return fp.concat(data[0],step) }
%}
  | steps _ %newline {% data => data[0] %}

step -> _ stepKeyword text %newline {% data => { return { type : data[1], text : data[2].trim() } } %}

stepKeyword -> %given {% (data) => { return { type : 'given', name : data[0].value } } %}
  | %when {% (data) => { return { type : 'when', name : data[0].value } } %}
  | %then {% (data) => { return { type : 'then', name : data[0].value } } %}

text -> null {% data => '' %}
  | text %word {% data => data[0]+data[1].value %}
  | text %ws {% data => data[0]+data[1].value %}
  | text %given {% data => data[0]+data[1].value %}
  | text %when {% data => data[0]+data[1].value %}
  | text %then {% data => data[0]+data[1].value %}
  | text %colon {% data => data[0]+data[1].value %}
  | text %scenario {% data => data[0]+data[1].value %}
  | text %example {% data => data[0]+data[1].value %}

freeform -> null {% data => '' %}
  | freeform text %newline {% (data) => {
  log.debug('freeform line: '+JSON.stringify([data[0],data[1],data[2]]));
  return data[0]+data[1]+'\n'
}
%}

_ -> null {% data => '' %}
  | %ws {% data => data[0].value %}
