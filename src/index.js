import { readdir } from 'node:fs/promises';
import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { log } from './logger.js';
import { parse } from './parse.js';

const featureRegex = /\.feature$/;

const compileFeatureToJS = (featureSrc) => {
    const feature = parse(featureSrc);

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
    log.debug('Test step: '+JSON.stringify(step)+' state:'+JSON.stringify(state));
    const stepDefinitionMatch = findStepDefinitionMatch(step);

    const newState = stepDefinitionMatch.stepDefinition.f(state,stepDefinitionMatch.parameters,step.dataTable);
    log.debug('Test newState: '+JSON.stringify(newState));

    return newState;
};

export const DataTable = (dataTable) => {
    const parameters = _.first(dataTable);
    const rows = _.tail(dataTable);

    return _.map((row) => _.zipObject(parameters,row))(rows);
}

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
