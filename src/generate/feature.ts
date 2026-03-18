import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { escape, shouldSkip } from './util.js';
import { glob } from 'glob';
import { generateExample } from './example.js';
import { generateRule } from './rule.js';
import { Statement, Rule, Example, isStatementType, Feature } from '../statement.js';
import { generateScenarioOutline } from './scenario-outline.js';
import { VitestCucumberPluginConfig } from '../config.js';

const findJsFiles: () => Promise<string[]> = async () => glob('features/**/*.[jt]s');

const generateFeature: (config: VitestCucumberPluginConfig, feature: Feature) => Promise<string> = async (
    config,
    feature,
) => {
    const name = feature.name;
    const statements = feature.statements;

    const testStatements = _.reduce((testStatements: string, statement: Statement) => {
        if (feature.background) {
            statement = _.set('background', feature.background, statement);
        }

        statement = _.set('tags', _.concat(feature.tags, statement.tags), statement);

        if (isStatementType(statement, 'example')) {
            return testStatements + generateExample(config, statement);
        } else if (isStatementType(statement, 'scenarioOutline')) {
            return testStatements + generateScenarioOutline(config, statement);
        } else if (isStatementType(statement, 'rule')) {
            return testStatements + generateRule(config, statement);
        }

        return testStatements;
    }, '')(statements);

    const skip = shouldSkip(config, feature.tags) ? '.skip' : '';
    const configStr = JSON.stringify(config);
    const tagsStr = JSON.stringify(feature.tags);

    const jsFilesImportReducer = (imports: string, file: string) => {
        file = file.slice('features/'.length);
        return (
            imports +
            `
import './${file}';`
        );
    };
    const jsFiles = await findJsFiles();
    const jsFilesImport = _.reduce(jsFilesImportReducer, '', jsFiles);

    const code = `import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import {
    Test,
    applyBeforeAllHooks,
    applyBeforeHooks,
    applyBeforeStepHooks,
    applyAfterAllHooks,
    applyAfterHooks,
    applyAfterStepHooks,
} from 'vitest-cucumber-plugin';
import { readdir } from 'node:fs/promises';
import { log, logConfig } from 'vitest-cucumber-plugin';${jsFilesImport}

logConfig(${JSON.stringify(config.log)});

var state = {};

beforeAll(async () => {
    state = await applyBeforeAllHooks(state,${tagsStr});
});

afterAll(async () => {
    state = await applyAfterAllHooks(state,${tagsStr});
});

// tags : ${tagsStr}
describe${skip}('${escape(feature.type.name)}: ${escape(name)}', () => {
${testStatements}});
`;

    return code;
};

export { generateFeature };
