import _ from 'lodash/fp.js';
import gherkinLexerShared from './gherkin-lexer-shared.cjs';
import fs from 'fs';

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
    const otherKeyReducer = (acc,key) => _.set(key,cleanKeywords(languageKeywords[key]),acc);
    const otherKeywords = _.reduce(otherKeyReducer,{})(otherKeys);

    keywords = _.set('repeatStep',repeatStepKeywords,otherKeywords);

    state = _.set(['word','rawKeywords'],keywords,state);

    return state;
}

export const gherkinLexerConfig = (options) => {
    const gherkinLanguagesPath = new URL('./gherkin-languages.json', import.meta.url);
    const gherkinLanguages = JSON.parse(fs.readFileSync(gherkinLanguagesPath));
    const language = _.getOr('en','language',options);
    const languageKeys = _.keys(gherkinLanguages);
    const languageKeyReducer = (acc,languageKey) => _.set(languageKey,createState(gherkinLanguages[languageKey]),acc);
    const states = _.reduce(languageKeyReducer,{},languageKeys);
    if (!_.has(language,states)) {
        throw new Error('unknown language "'+language+'"');
    }
    gherkinLexerShared.states = states;
    gherkinLexerShared.language = language;
};
