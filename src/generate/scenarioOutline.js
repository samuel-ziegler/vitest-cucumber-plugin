import _ from 'lodash/fp.js';
import { generateExamples } from './examples.js';
import { escape } from './util.js';

export const generateScenarioOutline = (scenarioOutline) => {
    const examplesStatements = _.reduce((examplesStatements,examplesStatement) => {
        return examplesStatements + generateExamples(scenarioOutline.steps,examplesStatement);
    },'')(scenarioOutline.examples);
    const code = `  describe('${escape(scenarioOutline.type.name)}: ${escape(scenarioOutline.name)}', () => {
${examplesStatements}
  });
`;

    return code;
}
