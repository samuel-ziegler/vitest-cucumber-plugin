import { escape } from './util.js';
import { generateTests } from './tests.js';
import _ from 'lodash/fp.js';
import { log } from '../logger.js';


export const generateExamples = (steps,examplesStatement) => {
    log.debug('generateExamples steps:'+JSON.stringify(steps)+' examples: '+JSON.stringify(examplesStatement));

    const parameters = _.head(examplesStatement.dataTable);
    const parameterValues = _.tail(examplesStatement.dataTable);

    log.debug('generateExamples parameters:'+JSON.stringify(parameters)+' parameterValues: '+
              JSON.stringify(parameterValues));

    const allTests = _.reduce((allTests,values) => {
        const parameterMap = _.reduce((parameterMap,value) => {
            return {
                map : _.set(parameters[parameterMap.index],value,parameterMap.map),
                index : parameterMap.index + 1
            };
        },{ map : {}, index : 0 })(values);
        
        log.debug('parameterMap : '+JSON.stringify(parameterMap.map));

        const tests = generateTests(steps,parameterMap.map,'    ');
        
        return { tests : allTests.tests + `
      describe('${allTests.index}',() => {${tests}
      });`, index : allTests.index + 1 };
    },{ tests : '', index : 0})(parameterValues);
    
    const code = `    describe('${escape(examplesStatement.type.name)}: ${escape(examplesStatement.name)}', () => {${allTests.tests}
    });`;
    return code;
}
