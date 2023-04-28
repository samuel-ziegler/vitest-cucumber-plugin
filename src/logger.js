import _ from 'lodash/fp.js';
import pino from 'pino';

export var log = pino();

log.level = 'warn';

export const logConfig = (config) => {
    if (_.has('file',config)) {
        log = pino(config,config.file);
    } else {
        log = pino(config);
    }
};
