/**
 * Engagement Lab Website v2.x
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

const ServerUtils = {
/**
 * Normalize a port into a number, string, or false.
 */

  normalizePort: (val) => {
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

};

// const urlValidator = {
//   validator(val) {
//     return !val || validator.isURL(val, {
//       protocols: ['http', 'https'],
//       require_tld: true,
//       require_protocol: false,
//       allow_underscores: true,
//     });
//   },
//   msg: 'Invalid link URL (e.g. needs http:// and .abc/)',
// };


/**
   * Event listener for HTTP server "error" event.
   */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

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
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

module.exports = ServerUtils;
