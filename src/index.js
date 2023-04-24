import nearley from 'nearley';
import gherkin from './gherkin.js';
import { readdir } from 'node:fs/promises';
import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { log } from './logger.js';

const featureRegex = /\.feature$/;

const escape = (str) => str.replace(/'/g,"\\'");

const compileFeatureToJS = (featureSrc) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(gherkin));

    log.debug('parsing src: '+featureSrc);
    parser.feed(featureSrc);

    if (parser.results.length == 0) {
        throw new Error('Unexpected end of file');
    }
    log.debug('parsing result: '+JSON.stringify(parser.results,null,2));
    if (parser.results.length > 1) {
        throw new Error('Ambiguous parsing: '+parser.results.length);
    }
    
    const results = parser.results;
    const feature = results[0];

    const code = generateFeature(feature);

    log.debug(code);

    return code;
}

export const importStepDefinitions = async () => {
    const stepDefinitionDirectory = 'features/step_definitions';
    const files = await readdir(stepDefinitionDirectory);
    for (const file of files) {
        const stepDefinition = './'+stepDefinitionDirectory+'/'+file;
        await import(stepDefinition);
    }
};

export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;

export const Test = (state,step) => {
    log.debug('Test state:'+JSON.stringify(state)+' step: '+JSON.stringify(step));
    const stepDefinitionMatch = findStepDefinitionMatch(step);

    return stepDefinitionMatch.stepDefinition.f(state,stepDefinitionMatch.parameters);
};

export default function vitestCucumberPlugin() {
    return {
        name : 'vitest-cucumber-transform',
        transform : async (src,id) => {
            if (featureRegex.test(id)) {
                const code = compileFeatureToJS(src);

                return {
                    code
                }
            }
        }
    }
}
