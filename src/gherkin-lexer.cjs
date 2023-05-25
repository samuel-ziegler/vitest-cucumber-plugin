const moo = require('moo');

let lexer = moo.compile({
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

const config = (options) => {
};

module.exports = {
    lexer : () => lexer,
    config,
};
