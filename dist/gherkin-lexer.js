import _ from 'lodash/fp.js';
import gherkinLexerShared from './gherkin-lexer-shared.js';
import fs from 'fs';
const base = {
    language: { match: /^#[ \t]*language:[ \t]*[a-z\-A-Z]+\n/, lineBreaks: true },
    emptyLine: { match: /^[ \t]*(?:\#[^\n]+)?\n/, lineBreaks: true },
    newline: { match: '\n', lineBreaks: true },
    ws: /[ \t]+/,
    at: '@',
    colon: ':',
    repeatStep: '*',
    pipe: '|',
    escapedPipe: '\\|',
    escapedNewline: '\\n',
    escapedBackSlash: '\\\\',
    scenarioOutline: [],
    docString: ['```', '"""'],
    word: {
        match: /[^ \t\n\:\|\@\*]+/,
    },
};
const trimKeywords = () => _.map(_.trim);
const filterStars = () => _.filter((v) => v !== '*');
const cleanKeywords = (keywords) => filterStars()(trimKeywords()(keywords));
const createState = (languageKeywords) => {
    let state = base;
    if (!_.isArray(languageKeywords.scenarioOutline)) {
        throw new Error(`Scenario Outline was not an array`);
    }
    state = _.set('scenarioOutline', cleanKeywords(languageKeywords.scenarioOutline), state);
    let keywords = {};
    let repeatStepKeys = ['and', 'but'];
    const repeatStepReducer = (keywords, repeatStepKey) => {
        const repeatStepKeywords = languageKeywords[repeatStepKey];
        if (!_.isArray(repeatStepKeywords)) {
            throw new Error(`${repeatStepKey} was not an array`);
        }
        return _.concat(keywords, cleanKeywords(repeatStepKeywords));
    };
    const repeatStepKeywords = _.reduce(repeatStepReducer, [])(repeatStepKeys);
    let otherKeys = ['feature', 'examples', 'given', 'when', 'then', 'scenario', 'background', 'rule'];
    const otherKeyReducer = (acc, key) => {
        const otherKeyKeywords = languageKeywords[key];
        if (!_.isArray(otherKeyKeywords)) {
            throw new Error(`${key} was not an array`);
        }
        return _.set(key, cleanKeywords(otherKeyKeywords), acc);
    };
    const otherKeywords = _.reduce(otherKeyReducer, {})(otherKeys);
    keywords = _.set('repeatStep', repeatStepKeywords, otherKeywords);
    state = _.set(['word', 'rawKeywords'], keywords, state);
    return state;
};
const gherkinLexerConfig = (options) => {
    const gherkinLanguagesPath = new URL('./gherkin-languages.json', import.meta.url);
    const gherkinLanguages = JSON.parse(fs.readFileSync(gherkinLanguagesPath).toString('utf-8'));
    const language = _.getOr('en', 'language', options);
    const languageKeys = _.keys(gherkinLanguages);
    const languageKeyReducer = (acc, languageKey) => _.set(languageKey, createState(gherkinLanguages[languageKey]), acc);
    const states = _.reduce(languageKeyReducer, {}, languageKeys);
    if (!_.has(language, states)) {
        throw new Error('unknown language "' + language + '"');
    }
    gherkinLexerShared.states = states;
    gherkinLexerShared.language = language;
};
export { gherkinLexerConfig };
//# sourceMappingURL=gherkin-lexer.js.map