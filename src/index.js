import { readdir } from 'node:fs/promises';
import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { log, setLogLevel } from './logger.js';
import { parse } from './parse.js';

const featureRegex = /\.feature$/;

const compileFeatureToJS = (config,featureSrc) => {
    const feature = parse(featureSrc);

    const code = generateFeature(config,feature);

    log.debug(code);

    return code;
}

export const importStepDefinitions = async (config) => {
    const stepDefinitionDirectory = config.root+'/features/step_definitions';
    const files = await readdir(stepDefinitionDirectory);
    for (const file of files) {
        const stepDefinition = stepDefinitionDirectory+'/'+file;
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
    let config;
    
    return {
        name : 'vitest-cucumber-transform',
        configResolved : (resolvedConfig) => {
            if (_.has('test.cucumber.logLevel',resolvedConfig)) {
                setLogLevel(resolvedConfig.test.cucumber.logLevel);
            }
            log.debug('config: resolvedConfig:'+JSON.stringify(resolvedConfig,null,2));
            config = _.get('test.cucumber',resolvedConfig);
            config = _.set('root',resolvedConfig.root,config);
            log.debug('config: '+JSON.stringify(config));
        },
        transform : async (src,id) => {
            if (featureRegex.test(id)) {
                const code = compileFeatureToJS(config,src);

                return {
                    code
                }
            }
        }
    }
}
