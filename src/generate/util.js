import _ from 'lodash/fp.js';
import { log } from '../logger.js';

export const escape = (str) => str.replace(/'/g,"\\'");
export const shouldSkip = (config,tags) => {
    const result = !config.tagsFunction(tags);
    log.debug('shouldSkip? '+result+' tags: '+JSON.stringify(tags));
    return result;
}
