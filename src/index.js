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

const compileFeatureToJS = async (config, featurePath, featureSrc) => {
    const feature = parse(featureSrc);

    const code = await generateFeature(config, featurePath, feature);

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
    log.debug({ step, state }, 'Test step');
    const stepDefinitionMatch = findStepDefinitionMatch(step);

    const extraData = step.dataTable ? step.dataTable : (step.docString ? step.docString.text : null );

    const newState = stepDefinitionMatch.stepDefinition.f(state,stepDefinitionMatch.parameters,extraData);
    log.info({ state, newState, extraData, parameters: stepDefinitionMatch.parameters }, `${step.type.name}('${stepDefinitionMatch.stepDefinition.expression}')`);
    log.debug({ newState }, 'Test newState');

    return newState;
};

export const DataTable = (dataTable) => {
    const parameters = _.first(dataTable);
    const rows = _.tail(dataTable);

    return _.map((row) => _.zipObject(parameters,row))(rows);
}

export default function vitestCucumberPlugin(options = {}) {
    let config;
    
    return {
        name : 'vitest-cucumber-transform',
        configResolved : (resolvedConfig) => {
            config = _.defaults({ root : resolvedConfig.root, stepDefinitionsPattern: 'features/**/*.js', log : { level : 'warn' } }, options)
            logConfig(config.log);

            config = _.set('tagsFunction',tagsFunction(_.get('tags',config)),config);

            log.debug({ config }, 'config');
        },
        transform : async (src,id) => {
            if (featureRegex.test(id)) {
                const code = await compileFeatureToJS(config, id, src);

                log.debug(`transform ${id} -> ${code}`);

                return {
                    code
                }
            }
        }
    }
}
