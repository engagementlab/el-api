module.exports = {
    apps: [{
        name: 'el-api',
        script: 'npm',
        args: ['run', 'start'],
        exec_interpreter: '/home/node/.nvm/versions/node/v14.14.0/bin/node',
        env_: {"NODE_ENV": "production",},
    }],

    deploy: {
        production: {
            user: 'node',
            host: '199.94.80.32',
            ref: 'origin/main',
            repo: 'https://github.com/engagementlab/el-api',
            path: '/srv/el-api',
            'post-setup': 'nvm use && npm i -g lerna yarn && npm i -g node-sass && yarn run bootstrap && yarn run build && yarn run css && pm2 start ecosystem.config.js',
            'post-deploy': 'nvm use && yarn run bootstrap && yarn run build && yarn run css && pm2 reload ecosystem.config.js --env production',
        },
    },
};