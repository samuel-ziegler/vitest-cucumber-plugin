const moo = require('moo');
const _ = require('lodash/fp.js');
const gherkinLanguages = require('./gherkin-languages.json');

const base = {
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
    docString : ['```','"""'],
    word : {
        match : /[^ \t\n\:\|\@\*]+/,
    },
};

let lexer;

const trimKeywords = (keywords) => _.map(_.trim);
const filterStars = (keywords) => _.filter((v) => (v !== '*'));
const cleanKeywords = (keywords) => filterStars()(trimKeywords()(keywords));

const createState = (languageKeywords) => {
    let state = base;

    state = _.set('scenarioOutline',cleanKeywords(languageKeywords.scenarioOutline),state);

    let keywords = {};

    let repeatStepKeys = ['and','but'];
    const repeatStepReducer = (keywords,repeatStepKey) =>
          _.concat(keywords,cleanKeywords(languageKeywords[repeatStepKey]));
    const repeatStepKeywords = _.reduce(repeatStepReducer,[])(repeatStepKeys);
    
    let otherKeys = ['feature','examples','given','when','then','scenario','background','rule'];
    const otherKeyReducer = (acc,key) => _.set(key,cleanKeywords(languageKeywords),acc);
    const otherKeywords = _.reduce(otherKeyReducer,{})(otherKeys);

    keywords = _.set('repeatStep',repeatStepKeywords,otherKeywords);

    state = _.set(['word','type'],moo.keywords(keywords),state);

    return state;
}

const config = (options) => {
    const language = _.getOr('en','language',options);
    const languageKeys = _.keys(gherkinLanguages);
    const languageKeyReducer = (acc,languageKey) => _.set(languageKey,createState(gherkinLanguages[languageKey]),acc);
    const states = _.reduce(languageKeyReducer,{},languageKeys);
    if (!_.has(language,states)) {
        throw new Error('unknown language "'+language+'"');
    }
    const startState = _.get(language,states);
    lexer = moo.compile(states,startState);
};

module.exports = {
    lexer : () => lexer,
    config,
};
