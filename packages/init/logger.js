/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2018-2020
 * ==============
 * Logger config
 *
 * @author Johnny Richardson
 *
 * ==========
 */

const winston = require('winston');

/**
 * Global logger instantiation.
 * @module 
 */
module.exports = (() => {

    const logFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => {
            const {
                timestamp,
                level,
                message,
                ...args
            } = info;

            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${ts} [${level}]: ${message} ${
                Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
                }`;
        })
    );

    global.logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [new winston.transports.Console()]
    });
    global.logger.simple = winston.createLogger({
        level: 'info',
        format: winston.format.printf(info => {
            const {
                message,
            } = info;
            return message;
        }),
        transports: [new winston.transports.Console()]
    });
})();