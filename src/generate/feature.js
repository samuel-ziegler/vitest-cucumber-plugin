import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { generateExample, generateScenarioOutline } from './index.js';
import { escape } from './util.js';

export const generateFeature = (feature) => {
    const name = feature.name;
    const statements = feature.statements;

    const testStatements = _.reduce((testStatements,statement) => {
        if (feature.background) {
            statement = _.set('background',feature.background,statement);
        }
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
