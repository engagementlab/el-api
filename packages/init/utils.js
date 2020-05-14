/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2018-2020
 * ==============
 * App utilities
 *
 * @author Johnny Richardson
 *
 * ==========
 */

// TODO: Make npm package
const validator = require('validator');
const fs = require('fs');
const path = require('path');

const ServerUtils = {
    /**
     * Normalize a port into a number, string, or false.
     */

    normalizePort: val => {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    },

    /*
            Borrowed from KeystoneJS classic/4.x:
            https://github.com/keystonejs/keystone-classic/blob/d34f45662eb359e2cb18b397f2ffea21f9883141/lib/core/importer.js
    */
    /**
     * Returns a function that looks in a specified path relative to the current
     * directory, and returns all .js modules in it (recursively).
     *
     * ####Example:
     *
     *    const importRoutes = importer(__dirname);
     *    const routes = importRoutes('get')
     *
     * @param {String} relDirname
     * @api public
     */
    routeImporter: relDirname => {
        function importer(from) {
            const imported = {};
            const joinPath = () => `${relDirname}${path.sep}${path.join(...arguments)}`;

            const fsPath = joinPath(from);
            fs.readdirSync(fsPath).forEach(name => {
                const info = fs.statSync(path.join(fsPath, name));
                if (info.isDirectory()) {
                    imported[name] = importer(joinPath(from, name));
                } else {
                    // only import files that we can `require`
                    const ext = path.extname(name);
                    const base = path.basename(name, ext);
                    if (require.extensions[ext]) {
                        imported[base] = require(path.join(relDirname, from, name));
                    } else {
                        global.logger.error('cannot require ', ext);
                    }
                }
            });

            return imported;
        }

        return importer;
    },

};

// const urlValidator = {
//     validator(val) {
//         return !val || validator.isURL(val, {
//             protocols: ['http', 'https'],
//             require_tld: true,
//             require_protocol: false,
//             allow_underscores: true,
//         });
//     },
//     msg: 'Invalid link URL (e.g. needs http:// and .abc/)',
// };


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ?
        `Pipe ${port}` :
        `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ?
        `pipe ${addr}` :
        `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}

module.exports = ServerUtils;