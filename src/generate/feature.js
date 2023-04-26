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

    const code = `import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import {
    Test,
    applyBeforeAllHooks,
    applyBeforeHooks,
    applyAfterAllHooks,
    applyAfterHooks,
} from 'vitest-cucumber-plugin';
import { readdir } from 'node:fs/promises';
import { log, setLogLevel } from 'vitest-cucumber-plugin';

setLogLevel('${config.logLevel}');

const importDirectory = async (directory) => {
    log.debug('importDirectory directory: '+directory);
    try {
        const files = await readdir(directory);

        for (const file of files) {
            const filename = directory+'/'+file;
            log.debug('importDirectory import: '+filename);
            await import(filename);
        }
    } catch (e) {
        log.debug('importDirectory error: '+e);
    }
};

const importSupportFiles = async (config) => importDirectory(config.root+'/features/support');

await importSupportFiles(${configStr});

const importStepDefinitions = async (config) => importDirectory(config.root+'/features/step_definitions');

await importStepDefinitions(${configStr});

var state = {};

beforeAll(async () => {
    state = await applyBeforeAllHooks(state);
});

afterAll(async () => {
    state = await applyAfterAllHooks(state);
});

// tags : ${JSON.stringify(feature.tags)}
describe${skip}('${escape(feature.type.name)}: ${escape(name)}', () => {
${testStatements}});
`;

    return code;
}
