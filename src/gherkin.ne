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
  (data) => { return { name : data[0].trim(), description : data[1].trim(), statements : data[2] } }
%}
featureStatement -> _ %feature _ %colon text %newline {% data => data[4] %}

statements -> null {% data => [] %}
  | statements example {% data => fp.concat(data[0],data[1]) %}
  | statements scenarioOutline

example -> exampleStatement steps {% (data) => { return { type : 'example', name : data[0].trim(), steps : data[1] } } %}
exampleStatement -> _ exampleKeyword _ %colon text %newline {% data => data[4] %}
exampleKeyword -> %example | %scenario

scenarioOutline -> scenarioOutlineStatement steps examples 
scenarioOutlineStatement -> _ scenarioOutlineKeyword _ %colon text %newline
scenarioOutlineKeyword -> %scenarioOutline | %scenarioTemplate

examples -> examplesStatement dataTable
examplesStatement -> _ examplesKeyword _ %colon text %newline
examplesKeyword -> %examples | %scenarios

dataTable -> null 
  | dataTable dataTableRow

dataTableRow -> _ %pipe dataTableColumns %newline

dataTableColumns -> null 
  | dataTableColumns text %pipe

steps -> null {% data => [] %}
  | steps step {% data => fp.concat(data[0],data[1]) %}
  | steps _ %newline {% data => data[0] %}

step -> _ stepKeyword text %newline {% data => { return { type : data[1], text : data[2].trim() } } %}

stepKeyword -> %given {% (data) => { return { type : 'given', name : data[0].value } } %}
  | %when {% (data) => { return { type : 'when', name : data[0].value } } %}
  | %then {% (data) => { return { type : 'then', name : data[0].value } } %}

text -> null {% data => '' %}
  | text %word {% data => data[0]+data[1].value %}
  | text %ws {% data => data[0]+data[1].value %}

freeform -> null {% data => '' %}
  | freeform text %newline {% (data) => {
  log.debug('freeform line: '+JSON.stringify([data[0],data[1],data[2]]));
  return data[0]+data[1]+'\n'
}
%}

_ -> null {% data => '' %}
  | %ws {% data => data[0].value %}
