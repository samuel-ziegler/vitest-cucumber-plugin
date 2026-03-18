import { Vite } from 'vitest/node';
import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { log, logConfig } from './logger.js';
import { parse } from './parse.js';
import { createTagsFunction } from './tags.js';
import {
    BeforeAll,
    applyBeforeAllHooks,
    Before,
    applyBeforeHooks,
    AfterAll,
    applyAfterAllHooks,
    After,
    applyAfterHooks,
    BeforeStep,
    applyBeforeStepHooks,
    AfterStep,
    applyAfterStepHooks,
} from './hooks.js';
import { gherkinLexerConfig } from './gherkin-lexer.js';
import { VitestCucumberPluginConfig } from './config.js';
import { State } from './state.js';
import { StepStatement } from './statement.js';

const featureRegex = /\.feature$/;

const compileFeatureToJS: (config: VitestCucumberPluginConfig, featureSrc: string) => Promise<string> = async (
    config,
    featureSrc,
) => {
    const feature = await parse(featureSrc);

    const code = await generateFeature(config, feature);

    return code;
};

const Given = addStepDefinition;
const When = addStepDefinition;
const Then = addStepDefinition;

const Test: (state: State, step: StepStatement) => State = (state, step) => {
    log.debug({ step, state }, 'Test step');
    const stepDefinitionMatch = findStepDefinitionMatch(step);

    const extraData = step.dataTable ? step.dataTable : step.docString ? step.docString.text : undefined;

    const newState = stepDefinitionMatch.stepDefinition.f(state, stepDefinitionMatch.parameters, extraData);
    log.info(
        { state, newState, extraData, parameters: stepDefinitionMatch.parameters },
        `${step.type.name}('${stepDefinitionMatch.stepDefinition.expression}')`,
    );
    log.debug({ newState }, 'Test newState');

    if (newState === undefined) {
        return state;
    }

    return newState;
};

const DataTable: (dataTable: Array<Array<string>>) => Array<Record<string, string>> = (dataTable) => {
    const parameters = _.first(dataTable);

    if (!parameters) {
        throw new Error('Data table was empty.');
    }

    const rows = _.tail(dataTable);

    return _.map((row: Array<string>) => _.zipObject(parameters, row))(rows);
};

const vitestCucumberPlugin: () => Vite.Plugin = () => {
    let config: VitestCucumberPluginConfig;

    return {
        name: 'vitest-cucumber-transform',
        configResolved: (resolvedConfig) => {
            config = _.defaults(
                { root: resolvedConfig.root, log: { level: 'warn' }, language: 'en' },
                _.get('test.cucumber', resolvedConfig),
            );
            logConfig(config.log);

            config = _.set('tagsFunction', createTagsFunction(_.get('tags', config)), config);

            log.debug({ config }, 'config');

            // Nearley has no mechanism for passing user data into the parser so need to do some hacky stuff here
            // and setup some globals to get around the limitations.
            gherkinLexerConfig(config);
        },
        transform: async (src, id) => {
            if (featureRegex.test(id)) {
                const code = await compileFeatureToJS(config, src);

                log.debug(`transform ${id} -> ${code}`);

                return {
                    code,
                };
            }
        },
    };
};

export {
    Given,
    When,
    Then,
    Test,
    log,
    logConfig,
    applyBeforeAllHooks,
    applyBeforeHooks,
    applyAfterAllHooks,
    applyAfterHooks,
    applyBeforeStepHooks,
    applyAfterStepHooks,
    BeforeAll,
    Before,
    AfterAll,
    After,
    BeforeStep,
    AfterStep,
    DataTable,
    vitestCucumberPlugin,
    State,
};
