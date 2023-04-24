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
        if (statement.type.type === 'example') {
            return testStatements + generateExample(config,statement);
        } else if (statement.type.type === 'scenarioOutline') {
            return testStatements + generateScenarioOutline(config,statement);
        }
    },'')(statements);

    const skip = shouldSkip(config,feature.tags) ? '.skip' : '';

    const code = `import { expect, test, describe } from 'vitest';
import { Test, importStepDefinitions } from 'vitest-cucumber-plugin';

await importStepDefinitions();

describe${skip}('${escape(feature.type.name)}: ${escape(name)}', () => {
${testStatements}});
`;
    log.debug(code);

    return code;
}
