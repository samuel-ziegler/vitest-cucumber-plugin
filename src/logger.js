import pino from 'pino';

export const log = pino();

log.level = 'warn';

export const setLogLevel = (logLevel) => { log.level = logLevel };
