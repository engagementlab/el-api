/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2018-2020
 * ==============
 * Server utilities
 *
 * @author Johnny Richardson
 *
 * ==========
 */

const fs = require('fs');
const path = require('path');

/**
 * Various utilities for express server instances
 * @returns {object} Utilities.
 */
const ServerUtils = {
	/**
	 * Normalize a port into a number, string, or false.
	 * @function
	 * @param port {string|number}
	 * @returns {number|string|boolean} Normalized port or false.
	 */
	normalizePort: val => {
		const port = parseInt(val, 10);

		if (Number.isNaN(port)) {
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
	*/
	/**
	 * Returns a function that looks in a specified path relative to the current
	 * directory, and returns all .js modules in it (recursively).
	 *
	 * @example
	 * const importRoutes = importer(__dirname);
	 * const routes = importRoutes('get')
	 * router.get('/get/page', routes.page);
	 * 
	 * @see https://github.com/keystonejs/keystone-classic/blob/d34f45662eb359e2cb18b397f2ffea21f9883141/lib/core/importer.js
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

module.exports = ServerUtils;