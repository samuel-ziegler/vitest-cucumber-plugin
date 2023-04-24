import _ from 'lodash/fp.js';
import { log } from '../logger.js';

export const escape = (str) => str.replace(/'/g,"\\'");
export const shouldSkip = (config,tags) => {
    const exclude = _.getOr([],'tags.exclude',config);
    const intersection = _.intersection(exclude,tags);
    log.debug('shouldSkip config: '+JSON.stringify(config)+' tags: '+JSON.stringify(tags)+' intersection: '+JSON.stringify(intersection));
    return intersection.length > 0;
}
