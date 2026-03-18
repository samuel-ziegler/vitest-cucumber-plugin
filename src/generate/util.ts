import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { Tags } from '../statement.js';
import { VitestCucumberPluginConfig } from '../config.js';

const escape = (str: string) => str.replace(/'/g, "\\'");
const shouldSkip = (config: VitestCucumberPluginConfig, tags?: Tags) => {
    const result = !config.tagsFunction(tags);
    log.debug(`shouldSkip? ${result} tags: ${JSON.stringify(tags)}`);
    return result;
};

export { escape, shouldSkip };
