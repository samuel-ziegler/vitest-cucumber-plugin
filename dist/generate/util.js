import { log } from '../logger.js';
const escape = (str) => str.replace(/'/g, "\\'");
const shouldSkip = (config, tags) => {
    const result = !config.tagsFunction(tags);
    log.debug(`shouldSkip? ${result} tags: ${JSON.stringify(tags)}`);
    return result;
};
export { escape, shouldSkip };
//# sourceMappingURL=util.js.map