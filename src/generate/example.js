import { escape } from './util.js';
import { generateTests } from './tests.js';

export const generateExample = (example) => {
    var tests = '';

    tests += generateTests(example.steps);
    
    const code = `  describe('${escape(example.type.name)}: ${escape(example.name)}', () => {${tests}
  });
`;
    return code;
}
