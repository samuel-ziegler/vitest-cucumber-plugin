import _ from 'lodash/fp.js';
import { generateExamples } from './examples.js';
import { escape, shouldSkip } from './util.js';
import { ScenarioOutline, Examples } from '../statement.js';
import { VitestCucumberPluginConfig } from '../config.js';

const generateScenarioOutline: (config: VitestCucumberPluginConfig, scenarioOutline: ScenarioOutline) => string = (
    config,
    scenarioOutline,
) => {
    const examplesStatements = _.reduce((examplesStatements: string, examplesStatement: Examples) => {
        examplesStatement = _.set('tags', _.concat(scenarioOutline.tags, examplesStatement.tags), examplesStatement);

        return examplesStatements + generateExamples(config, scenarioOutline.steps, examplesStatement);
    }, '')(scenarioOutline.examples);

    const skip = shouldSkip(config, scenarioOutline.tags) ? '.skip' : '';

    const code = `  // tags : ${JSON.stringify(scenarioOutline.tags)}
  describe${skip}('${escape(scenarioOutline.type.name)}: ${escape(scenarioOutline.name)}', () => {
${examplesStatements}
  });
`;

    return code;
};

export { generateScenarioOutline };
