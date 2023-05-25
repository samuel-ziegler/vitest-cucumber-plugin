import { escape, shouldSkip } from './util.js';
import { generateTests } from './tests.js';
import _ from 'lodash/fp.js';
import { log } from '../logger.js';

const createParameterMap = (parameters,values) => {
    const parameterMap = _.reduce((parameterMap,value) => {
        return {
            map : _.set(parameters[parameterMap.index],value,parameterMap.map),
            index : parameterMap.index + 1
        };
    },{ map : {}, index : 0 })(values);

    return parameterMap.map;
}

const generateAllTests = (steps,parameters,parameterValues,tags) => {
    const allTests = _.reduce((allTests,values) => {
        const parameterMap = createParameterMap(parameters,values);
        log.debug(`parameterMap : ${JSON.stringify(parameterMap)}`);

        const tests = generateTests(steps,parameterMap,tags,'    ');

        return { tests : allTests.tests + `
      describe('${allTests.index}',() => {${tests}
      });`, index : allTests.index + 1 };
    },{ tests : '', index : 0})(parameterValues);

    return allTests.tests;
}

export const generateExamples = (config,steps,examplesStatement) => {
    log.debug(`generateExamples steps:${JSON.stringify(steps)} examples: ${JSON.stringify(examplesStatement)}`);

    const parameters = _.head(examplesStatement.dataTable);
    const parameterValues = _.tail(examplesStatement.dataTable);

    log.debug(`generateExamples parameters:${JSON.stringify(parameters)} parameterValues: ${JSON.stringify(parameterValues)}`);

    const skip = shouldSkip(config,examplesStatement.tags) ? '.skip' : '';

    const allTests = generateAllTests(steps,parameters,parameterValues,examplesStatement.tags);
    const code = `
    // tags : ${JSON.stringify(examplesStatement.tags)}
    describe${skip}('${escape(examplesStatement.type.name)}: ${escape(examplesStatement.name)}', () => {${allTests}
    });`;
    return code;
}
