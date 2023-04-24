import _ from 'lodash/fp.js';
import { escape } from './util.js';
import { parameterizeText } from '../parameterize.js';

export const generateTests = (steps,parameterMap,extraIndent) => {
    const indent = extraIndent ? extraIndent : '';
    let tests = `
${indent}    var state = {};`;
    
    _.forEach((step) => {
        const parameterizedText = ( parameterMap ? parameterizeText(step.text,parameterMap) : step.text);
        const name = parameterizedText;

        const stepString = JSON.stringify({ type : step.type, text : parameterizedText });
        tests = tests+`
${indent}    test('${escape(step.type.name)} ${escape(name)}', () => { state = Test(state,${stepString}); });`;
    },steps);

    return tests;
};
