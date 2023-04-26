import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { log, setLogLevel } from './logger.js';
import { parse } from './parse.js';
import { tagsFunction } from './tags.js';
import {
    BeforeAll, applyBeforeAllHooks,
    Before, applyBeforeHooks,
    AfterAll, applyAfterAllHooks,
    After, applyAfterHooks,
} from './hooks.js';

const featureRegex = /\.feature$/;

const compileFeatureToJS = (config,featureSrc) => {
    const feature = parse(featureSrc);

    const code = generateFeature(config,feature);

    return code;
}

export { BeforeAll, Before, AfterAll, After };

export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks };

export { setLogLevel, log };

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
            config = _.defaults({ root : resolvedConfig.root, logLevel : 'warn' },_.get('test.cucumber',resolvedConfig))
            setLogLevel(config.logLevel);

            config = _.set('tagsFunction',tagsFunction(_.get('tags',config)),config);

            log.debug('config: '+JSON.stringify(config));
        },
        transform : async (src,id) => {
            if (featureRegex.test(id)) {
                const code = compileFeatureToJS(config,src);

                log.debug('transform '+id+' -> '+code);

                return {
                    code
                }
            }
        }
    }
}
