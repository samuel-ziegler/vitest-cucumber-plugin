import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { generateExample, generateScenarioOutline } from './index.js';
import { escape, shouldSkip } from './util.js';

export const generateFeature = (config,feature) => {
    const name = feature.name;
    const statements = feature.statements;

    const testStatements = _.reduce((testStatements,statement) => {
        if (feature.background) {
            statement = _.set('background',feature.background,statement);
        }

        statement = _.set('tags',_.concat(feature.tags,statement.tags),statement);
        
        if (statement.type.type === 'example') {
            return testStatements + generateExample(config,statement);
        } else if (statement.type.type === 'scenarioOutline') {
            return testStatements + generateScenarioOutline(config,statement);
        }
    },'')(statements);

    const skip = shouldSkip(config,feature.tags) ? '.skip' : '';
    const configStr = JSON.stringify(config);

    const code = `import { expect, test, describe } from 'vitest';
import { Test } from 'vitest-cucumber-plugin';
import { readdir } from 'node:fs/promises';

const importStepDefinitions = async (config) => {
    const stepDefinitionDirectory = config.root+'/features/step_definitions';
    const files = await readdir(stepDefinitionDirectory);
    for (const file of files) {
        const stepDefinition = stepDefinitionDirectory+'/'+file;
        await import(stepDefinition);
    }
};

await importStepDefinitions(${configStr});

// tags : ${JSON.stringify(feature.tags)}
describe${skip}('${escape(feature.type.name)}: ${escape(name)}', () => {
${testStatements}});
`;

    return code;
}
