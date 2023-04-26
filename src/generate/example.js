import { escape, shouldSkip } from './util.js';
import { generateTests } from './tests.js';
import _ from 'lodash/fp.js';
import { log } from '../logger.js';

export const generateExample = (config,example) => {
    log.debug('generateExample config: '+JSON.stringify(config)+' example: '+JSON.stringify(example));
    var tests = '';

    const steps = _.has('background.steps',example) ? _.concat(example.background.steps,example.steps) : example.steps;

    tests += generateTests(steps);
    
    const skip = shouldSkip(config,example.tags) ? '.skip' : '';

    const code = `  // tags : ${JSON.stringify(example.tags)}
  describe${skip}('${escape(example.type.name)}: ${escape(example.name)}', () => {${tests}
  });
`;
    return code;
}
