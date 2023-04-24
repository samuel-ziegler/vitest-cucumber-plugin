import _ from 'lodash/fp.js';
import { generateExamples } from './examples.js';
import { escape, shouldSkip } from './util.js';

export const generateScenarioOutline = (config,scenarioOutline) => {
    const examplesStatements = _.reduce((examplesStatements,examplesStatement) => {
        return examplesStatements + generateExamples(config,scenarioOutline.steps,examplesStatement);
    },'')(scenarioOutline.examples);

    const skip = shouldSkip(config,scenarioOutline.tags) ? '.skip' : '';

    const code = `  describe${skip}('${escape(scenarioOutline.type.name)}: ${escape(scenarioOutline.name)}', () => {
${examplesStatements}
  });
`;

    return code;
}
