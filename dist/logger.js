import { pino } from 'pino';
var log = pino();
log.level = 'warn';
const logConfig = (config) => {
    log = pino(config);
};
export { log, logConfig };
//# sourceMappingURL=logger.js.map