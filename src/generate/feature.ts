import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { escape, shouldSkip } from './util.js';
import { glob } from 'glob';
import { generateExample } from './example.js';
import { generateRule } from './rule.js';
import { Statement, Rule, Example, isStatementType, Feature } from '../statement.js';
import { generateScenarioOutline } from './scenario-outline.js';
import { VitestCucumberPluginConfig } from '../config.js';
import path from 'node:path';

interface FindJsFileOptions {
    include: string | string[];
}

const findJsFiles: (options: FindJsFileOptions) => Promise<string[]> = async (options) => glob(options.include);

interface GenerateFeatureOptions {
    config: VitestCucumberPluginConfig;
    feature: Feature;
    featurePath: string;
}

const generateFeature: (options: GenerateFeatureOptions) => Promise<string> = async (options) => {
    log.debug({ generateFeature: { options } });

    const { config, feature, featurePath } = options;

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
    const tagsStr = JSON.stringify(feature.tags);

    const cwd = process.cwd();

    const jsFilesImportReducer = (imports: string, file: string) => {
        const absolutePath = `${cwd}/${file}`;
        const relativePath = path.relative(path.dirname(featurePath), absolutePath);
        return (
            imports +
            `
import './${relativePath}';`
        );
    };
    const jsFiles = await findJsFiles(config.stepDefinitions);
    log.debug({ featurePath, cwd, jsFiles });
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
