import { escape, shouldSkip } from './util.js';
import { generateTests } from './tests.js';
import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { Examples, StepStatement } from '../statement.js';
import { VitestCucumberPluginConfig } from '../config.js';

const createParameterMap: (parameters: Array<string>, values: Array<string>) => Record<string, string> = (
    parameters,
    values,
) => {
    interface Acc {
        map: Record<string, string>;
        index: number;
    }

    const parameterMap = _.reduce(
        (parameterMap: Acc, value: string) => {
            return {
                map: _.set(parameters[parameterMap.index], value, parameterMap.map),
                index: parameterMap.index + 1,
            };
        },
        { map: {}, index: 0 },
    )(values);

    return parameterMap.map;
};

const generateAllTests: (
    steps: StepStatement[],
    parameters?: Array<string>,
    parameterValues?: Array<Array<string>>,
    tags?: Array<string>,
) => string = (steps, parameters, parameterValues, tags) => {
    parameters = parameters ?? [];
    parameterValues = parameterValues ?? [];
    tags = tags ?? [];

    interface Acc {
        tests: string;
        index: number;
    }

    const allTests = _.reduce(
        (allTests: Acc, values: Array<string>) => {
            const parameterMap = createParameterMap(parameters, values);
            log.debug(`parameterMap : ${JSON.stringify(parameterMap)}`);

            const tests = generateTests(steps, parameterMap, tags, '    ');

            return {
                tests:
                    allTests.tests +
                    `
      describe('${allTests.index}',() => {${tests}
      });`,
                index: allTests.index + 1,
            };
        },
        { tests: '', index: 0 },
    )(parameterValues);

    return allTests.tests;
};

const generateExamples: (
    config: VitestCucumberPluginConfig,
    steps: Array<StepStatement>,
    examplesStatement: Examples,
) => string = (config, steps, examplesStatement) => {
    log.debug(`generateExamples steps:${JSON.stringify(steps)} examples: ${JSON.stringify(examplesStatement)}`);

    const parameters = _.head(examplesStatement.dataTable);
    const parameterValues = _.tail(examplesStatement.dataTable);

    log.debug(
        `generateExamples parameters:${JSON.stringify(parameters)} parameterValues: ${JSON.stringify(parameterValues)}`,
    );

    const skip = shouldSkip(config, examplesStatement.tags) ? '.skip' : '';

    const allTests = generateAllTests(steps, parameters, parameterValues, examplesStatement.tags);
    const code = `
    // tags : ${JSON.stringify(examplesStatement.tags)}
    describe${skip}('${escape(examplesStatement.type.name)}: ${escape(examplesStatement.name)}', () => {${allTests}
    });`;
    return code;
};

export { generateExamples };
