import nearley from 'nearley';
import { log } from './logger.js';

let gherkinSingleton;

const parser = async () => {
    if (!gherkinSingleton) {
        // Need to dynamicly load the gherkin parser because it needs to be loaded after the
        // magic globals are set up.  Pretty lame, I know.
        const gherkinImport = await import('./gherkin.js');
        gherkinSingleton = gherkinImport['default'];
    }

    return new nearley.Parser(nearley.Grammar.fromCompiled(gherkinSingleton));
};

export const parse = async (src) => {
    const myParser = await parser();
    log.debug(`parsing src: ${src}`);
    myParser.feed(src);

    if (myParser.results.length == 0) {
        throw new Error('Unexpected end of file');
    }
    log.debug({ results: myParser.results }, 'parsing result');
    if (myParser.results.length > 1) {
        throw new Error('Ambiguous parsing: '+myParser.results.length);
    }
    
    const results = myParser.results;
    return results[0];
}
