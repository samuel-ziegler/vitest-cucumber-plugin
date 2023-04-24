import { escape } from './util.js';
import { generateTests } from './tests.js';
import _ from 'lodash/fp.js';
import { log } from '../logger.js';

export const generateExample = (example) => {
    log.debug('generateExample example: '+JSON.stringify(example));
    var tests = '';

    const steps = _.has('background.steps',example) ? _.concat(example.background.steps,example.steps) : example.steps;

    tests += generateTests(steps);
    
    const code = `  describe('${escape(example.type.name)}: ${escape(example.name)}', () => {${tests}
  });
`;
    return code;
}
