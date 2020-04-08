/*
    Borrowed from KeystoneJS classic/4.x:
    https://github.com/keystonejs/keystone-classic/blob/d34f45662eb359e2cb18b397f2ffea21f9883141/lib/core/importer.js
*/
const fs = require('fs');
const debug = require('debug')('keystone:core:importer');
const path = require('path');

/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules in it (recursively).
 *
 * ####Example:
 *
 *     var importRoutes = keystone.importer(__dirname);
 *
 *     var routes = {
 *         site: importRoutes('./site'),
 *         api: importRoutes('./api')
 *     };
 *
 * @param {String} rel__dirname
 * @api public
 */

function dispatchImporter(rel__dirname) {
  function importer(from) {
    debug('importing ', from);
    const imported = {};
    const joinPath = function () {
      return `.${path.sep}${path.join.apply(path, arguments)}`;
    };

    const fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
    fs.readdirSync(fsPath).forEach((name) => {
      const info = fs.statSync(path.join(fsPath, name));
      debug('recur');
      if (info.isDirectory()) {
        imported[name] = importer(joinPath(from, name));
      } else {
        // only import files that we can `require`
        const ext = path.extname(name);
        const base = path.basename(name, ext);
        if (require.extensions[ext]) {
          imported[base] = require(path.join(rel__dirname, from, name));
        } else {
          debug('cannot require ', ext);
        }
      }
    });

    return imported;
  }

  return importer;
}

module.exports = dispatchImporter;
