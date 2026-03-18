import { escape, shouldSkip } from './util.js';
import { generateTests } from './tests.js';
import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { Example } from '../statement.js';
import { VitestCucumberPluginConfig } from '../config.js';

const generateExample: (config: VitestCucumberPluginConfig, example: Example) => string = (config, example) => {
    log.debug(`generateExample config: ${JSON.stringify(config)} example: ${JSON.stringify(example)}`);
    var tests = '';

    const steps = example.background ? _.concat(example.background.steps, example.steps) : example.steps;

    tests += generateTests(steps, {}, example.tags);

    const skip = shouldSkip(config, example.tags) ? '.skip' : '';

    const code = `  // tags : ${JSON.stringify(example.tags)}
  describe${skip}('${escape(example.type.name)}: ${escape(example.name)}', () => {${tests}
  });
`;
    return code;
};

export { generateExample, Example };
