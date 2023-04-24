import nearley from 'nearley';
import gherkin from './gherkin.js';
import { log } from './logger.js';

export const parse = (src) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(gherkin));

    log.debug('parsing src: '+src);
    parser.feed(src);

    if (parser.results.length == 0) {
        throw new Error('Unexpected end of file');
    }
    log.debug('parsing result: '+JSON.stringify(parser.results,null,2));
    if (parser.results.length > 1) {
        throw new Error('Ambiguous parsing: '+parser.results.length);
    }
    
    const results = parser.results;
    return results[0];
}
