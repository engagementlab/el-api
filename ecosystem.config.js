module.exports = {
    apps: [{
        name: 'el-api',
        script: 'npm start',
        exec_interpreter: '/home/node/.nvm/versions/node/v14/bin/node',
        env_: {"NODE_ENV": "production",},
    }],

    deploy: {
        production: {
            user: 'node',
            host: '199.94.80.32',
            ref: 'origin/master',
            repo: 'https://github.com/engagementlab/el-api',
            path: '/srv/el-api',
            'post-setup': 'nvm use && npm i -g lerna yarn && yarn run bootstrap && pm2 start ecosystem.config.js',
            'post-deploy': 'nvm use && yarn run bootstrap && pm2 reload ecosystem.config.js --env production',
        },
    },
};