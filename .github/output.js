/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2022
 *
 * @author Johnny Richardson
 * Get config data for all sibling app packages output 
 * ==========
 */

 const fs = require('fs');
 const path = require('path');
 
 /**
 * Get config data for all sibling app packages and then output data to module in ./packages/core.
 * @function
 */
 module.exports = (function() {
    const pkgsPath = path.join(__dirname, '../packages');
    const dirs = fs.readdirSync(pkgsPath);
    let dirsFiltered = null;
    let namesStr = '';
    const namesObj = {};

    dirs.forEach(name => {
        if (fs.statSync(path.join(pkgsPath, name)).isDirectory()) {
            // Skip if no config.json
            if (!fs.existsSync(path.join(pkgsPath, name, 'config.json'))) return;
            // Get formal app name
            const configData = JSON.parse(
                fs.readFileSync(path.join(pkgsPath, name, 'config.json'))
            );
            // Obj for usage in build gen and API mount
            namesObj[configData.schema] = {
                name: configData.name,
                repo: configData.repo,
                dir: name,
            };
            namesStr += `\n    🔸 ${colors.bold(configData.name)} (${colors.yellow(
                name
            )})`;
        }
    });

    console.info(
            `Packages found: ${namesStr}`
    );
    // console.log(namesObj)
    fs.writeFileSync(path.join(__dirname, '../packages/core/packages-list.js'), `module.exports = ${JSON.stringify(namesObj)}`)
})();