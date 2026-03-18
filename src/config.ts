import { Tags } from './statement.js';
import { LoggerOptions } from './logger.js';

interface VitestCucumberPluginConfig {
    tagsFunction: (tags?: Tags) => boolean;
    log: LoggerOptions;
}

export { VitestCucumberPluginConfig };
