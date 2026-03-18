import { pino, LoggerOptions } from 'pino';

var log = pino();

log.level = 'warn';

const logConfig = (config: LoggerOptions) => {
    log = pino(config);
};

export { log, logConfig, LoggerOptions };
