import nearley from 'nearley';
import gherkin from './gherkin.js';
import { readdir } from 'node:fs/promises';
import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateTests, generateExample } from './generate/index.js';
import { log } from './logger.js';

const featureRegex = /\.feature$/;

const escape = (str) => str.replace(/'/g,"\\'");


const generateExamples = (steps,examplesStatement) => {
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

const generateScenarioOutline = (scenarioOutline) => {
    const examplesStatements = _.reduce((examplesStatements,examplesStatement) => {
        return examplesStatements + generateExamples(scenarioOutline.steps,examplesStatement);
    },'')(scenarioOutline.examples);
    const code = `  describe('${escape(scenarioOutline.type.name)}: ${escape(scenarioOutline.name)}', () => {
${examplesStatements}
  });
`;

    return code;
}

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
    const name = feature.name;
    const statements = feature.statements;

    const testStatements = _.reduce((testStatements,statement) => {
        if (statement.type.type === 'example') {
            return testStatements + generateExample(statement);
        } else if (statement.type.type === 'scenarioOutline') {
            return testStatements + generateScenarioOutline(statement);
        }
    },'')(statements);

    const code = `import { expect, test, describe } from 'vitest';
import { Test, importStepDefinitions } from 'vitest-cucumber-plugin';

await importStepDefinitions();

describe('${escape(feature.type.name)}: ${escape(name)}', () => {
${testStatements}});
`;
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
