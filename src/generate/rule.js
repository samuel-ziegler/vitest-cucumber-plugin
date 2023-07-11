import _ from 'lodash/fp.js';
import { generateExample } from './index.js';
import { escape, shouldSkip } from './util.js';
import { log } from '../logger.js';

export const generateRule = (config,rule) => {
    log.debug(`generateRule config: ${JSON.stringify(config)} rule: ${JSON.stringify(rule)}`);
    
    const examplesCode = _.reduce((examplesCode,example) => {
        return examplesCode + generateExample(config,example);
    },'')(rule.examples);

    const skip = shouldSkip(config,rule.tags) ? '.skip' : '';
    const tagsStr = JSON.stringify(rule.tags);

    const code = `  // tags : ${tagsStr}
  describe${skip}('${escape(rule.type.name)}: ${escape(rule.name)}', () => {
${examplesCode}});
`;

    return code;
}
