module.exports = {
    apps: [{
        name: 'el-api',
        script: 'npm start',
        watch: '.',
    }],

    deploy: {
        production: {
            user: 'node',
            host: '199.94.80.32',
            ref: 'origin/master',
            repo: 'https://github.com/engagementlab/el-api',
            path: '/srv/el-api',
            'post-deploy': 'nvm use && npm i -g lerna && yarn run bootstrap && pm2 reload ecosystem.config.js --env production',
        },
    },
};