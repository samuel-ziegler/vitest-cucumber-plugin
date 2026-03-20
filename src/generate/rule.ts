import _ from 'lodash/fp.js';
import { escape, shouldSkip } from './util.js';
import { log } from '../logger.js';
import { generateExample, Example } from './example.js';
import { Rule } from '../statement.js';
import { VitestCucumberPluginConfig } from '../config.js';

const generateRule: (config: VitestCucumberPluginConfig, rule: Rule) => string = (config, rule) => {
    log.debug(`generateRule config: ${JSON.stringify(config)} rule: ${JSON.stringify(rule)}`);

    const examplesCode = _.reduce((examplesCode: string, example: Example) => {
        return examplesCode + generateExample(config, example);
    }, '')(rule.examples);

    const skip = shouldSkip(config, rule.tags) ? '.skip' : '';
    const tagsStr = JSON.stringify(rule.tags);

    const code = `  // tags : ${tagsStr}
  describe${skip}('${escape(rule.type.name)}: ${escape(rule.name)}', () => {
${examplesCode}});
`;

    return code;
};

export { generateRule };
