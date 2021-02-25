const fs = require('fs');
const path = require('path');

const prompts = require('prompts');
const nodemon = require('nodemon');

/**
 * Get config data for all app packages and prompt for which one to use in dev instance.
 */
(async () => {
    const pkgsPath = path.join(__dirname, 'packages');
    const dirs = fs.readdirSync(pkgsPath);
    const choices = [];

    // Do not include 'init' package
    const dirsFiltered = dirs.filter(name => name !== 'init');

    dirsFiltered.forEach(name => {
        if (fs.statSync(path.join(pkgsPath, name)).isDirectory()) {
            // Skip if no config.json
            if (!fs.existsSync(path.join(pkgsPath, name, 'config.json'))) return;
            // Get formal app name
            const configData = JSON.parse(
                fs.readFileSync(path.join(pkgsPath, name, 'config.json'))
            );
            // Obj for usage in choices
            choices.push({
                title: configData.name,
                description: name,
                value: name,
            });
        }
    });

    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Pick a package to run:',
        choices,
    });

    if(!response.value) return;

    // Kick off nodemon
    nodemon({
        script: './packages/core/index.js',
        args: [' --inspect=0.0.0.0:9229', '--server', `--package=${response.value}`, '--trace-warnings'],
    });
})();