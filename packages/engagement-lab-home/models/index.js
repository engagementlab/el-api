/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Models/Lists loader
 * ==========
 */

const fs = require('fs');
const filesDir = require('path').join(__dirname, 'all');

module.exports = () => {
    const modules = [];
    const files = fs.readdirSync(filesDir);
    files.forEach(file => {
        modules.push(require(`${filesDir}/${file}`));
    });
    return modules;
};
