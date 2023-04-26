import _ from 'lodash/fp.js';
import { generateExamples } from './examples.js';
import { escape, shouldSkip } from './util.js';

export const generateScenarioOutline = (config,scenarioOutline) => {
    const examplesStatements = _.reduce((examplesStatements,examplesStatement) => {
        examplesStatement = _.set('tags',_.concat(scenarioOutline.tags,examplesStatement.tags),examplesStatement);
        
        return examplesStatements + generateExamples(config,scenarioOutline.steps,examplesStatement);
    },'')(scenarioOutline.examples);

    const skip = shouldSkip(config,scenarioOutline.tags) ? '.skip' : '';

    const code = `  // tags : ${JSON.stringify(scenarioOutline.tags)}
  describe${skip}('${escape(scenarioOutline.type.name)}: ${escape(scenarioOutline.name)}', () => {
${examplesStatements}
  });
`;

    return code;
}
