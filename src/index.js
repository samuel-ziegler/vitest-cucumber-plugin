import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { log, logConfig } from './logger.js';
import { parse } from './parse.js';
import { tagsFunction } from './tags.js';
import {
    BeforeAll, applyBeforeAllHooks,
    Before, applyBeforeHooks,
    AfterAll, applyAfterAllHooks,
    After, applyAfterHooks,
    BeforeStep, applyBeforeStepHooks,
    AfterStep, applyAfterStepHooks,
} from './hooks.js';

const featureRegex = /\.feature$/;

const compileFeatureToJS = async (config,featureSrc) => {
    const feature = parse(featureSrc);

    const code = await generateFeature(config,feature);

    return code;
}

export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };

export {
    applyBeforeAllHooks,
    applyBeforeHooks,
    applyAfterAllHooks,
    applyAfterHooks,
    applyBeforeStepHooks,
    applyAfterStepHooks,
};

export { log, logConfig };

export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;

export const Test = (state,step) => {
    log.debug('Test step: '+JSON.stringify(step)+' state:'+JSON.stringify(state));
    const stepDefinitionMatch = findStepDefinitionMatch(step);

    const extraData = step.dataTable ? step.dataTable : (step.docString ? step.docString.text : null );

    const newState = stepDefinitionMatch.stepDefinition.f(state,stepDefinitionMatch.parameters,extraData);
    log.info(step.type.name+'(\''+stepDefinitionMatch.stepDefinition.expression+'\') ('+
             JSON.stringify(state)+','+JSON.stringify(stepDefinitionMatch.parameters)+','+JSON.stringify(extraData)+
             ') => '+JSON.stringify(newState));
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
            config = _.defaults({ root : resolvedConfig.root, log : { level : 'warn' } },
                                _.get('test.cucumber',resolvedConfig))
            logConfig(config.log);

            config = _.set('tagsFunction',tagsFunction(_.get('tags',config)),config);
            config = _.set('extensions', resolvedConfig.resolve.extensions, config)

            log.debug('config: '+JSON.stringify(config));
        },
        transform : async (src,id) => {
            if (featureRegex.test(id)) {
                const code = await compileFeatureToJS(config,src);

                log.debug('transform '+id+' -> '+code);

                return {
                    code
                }
            }
        }
    }
}
