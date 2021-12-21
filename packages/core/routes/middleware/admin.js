/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020-21
 *
 * @author Johnny Richardson
 * Admin actions middleware
 * ==========
 */
const {request,} = require("@octokit/request");
const fs = require('fs');
const {
    exec,
} = require('child_process');

// Build utils
const utils = require('../../build/utils')();

// User model
const User = require('../../models/User');

module.exports = {
    /**
     * Render admin page
     * @function
     */
    landing: (req, res) => {
        // Get all apps
        const appsInfo = utils.GetPackagesData(false);
        const userPic = (req.session.passport && req.session.passport.user) ? req.session.passport.user.photo : '';
        User.find({}, (err, users) => {
            res.render('admin', {
                apps: appsInfo,
                onAdmin: true,
                users,
                userPic,
            });
        });
    },

    /**
     * Middleware for admin user modification
     * @function
     */
    userCrud: (req, res) => {

        try {
            const {
                body,
            } = req;
            if (!body) res.status(500).send('no body');

            if (body.email && body.name) {
                User.create({
                    name: body.name,
                    email: body.email,
                    isAdmin: body.isAdmin,
                    permissions: body.permissions,
                }, (err, user) => {
                    if (err) {
                        // Catch dupe email
                        if (err.name === 'MongoError' && err.keyPattern && err.keyPattern.email === 1)
                            res.status(500).send({
                                msg: 'email',
                            });
                        else
                            res.status(500).send(err);
                    } else {
                        res.status(200).send({
                            msg: 'created',
                        });
                    }
                });
            } else {

                User.findOne({
                    $or: [{
                        _id: body.userId,
                    }, {
                        email: body.email,
                    }],
                }, async (err, user) => {
                    if (err) res.status(500).send(err);
                    else if (body.delete) {
                        if (!user) {
                            res.status(500).send();
                            return;
                        }
                        user.delete();
                        res.status(200).send({
                            msg: 'deleted',
                        });
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        if (body.permissions) user.permissions = body.permissions;
                        // eslint-disable-next-line no-param-reassign
                        if (body.isAdmin !== undefined) user.isAdmin = body.isAdmin;
                        user.save();
                        res.status(200).send({
                            msg: 'saved',
                        });
                    }
                });
            }
        } catch (saveErr) {
            global.logger.error(saveErr);
            res.status(500).send(saveErr.toString());
        }

    },

    /**
     * Dump specified QA database and then override corresponding Production database
     * @function
     */
    transferDb: (req, res) => {
        try {
            // Remove previous local backup
            if (fs.existsSync(`./db/${req.params.db}`))
                fs.rmdirSync(`./db/${req.params.db}`, {
                    recursive: true,
                    force: true,
                });

            // First, dump current QA DB to local dir
            exec(`mongodump --uri ${process.env.MONGO_CLOUD_URI}${req.params.db} --out ./db`, dumpErr => {
                if (!dumpErr) {
                    // Then, if no errors, drop Prod DB and restore via backup just made
                    exec(`mongorestore --drop --uri ${process.env.MONGO_CLOUD_PROD_URI} -d ${req.params.db} ./db/${req.params.db} 2>> log.txt`, restoreErr => {
                        if (!restoreErr)
                            res.status(200).send({
                                msg: 'done',
                            });
                        else {
                            global.logger.error(restoreErr);
                            res.status(500).send({
                                err: restoreErr,
                            });
                        }
                    });
                } else {
                    global.logger.error(dumpErr);
                    res.status(500).send({
                        err: dumpErr,
                    });
                }
            });

        } catch (err) {
            global.logger.error(err);
            res.status(500).send({
                err,
            });
        }

    },

    deployProd: async (req, res) => {
        const appInfo = utils.GetPackagesData(false, req.params.schema);
        const requestWithAuth = request.defaults({
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
        });

        const repoName = Object.values(appInfo)[0].repo;
        const workflowError = `We were unable to get the status of this deployment, however you should be able to find its status here: https://github.com/engagementlab/${repoName}/actions`;
 
        try {

            const dispatchResponse = await requestWithAuth('POST /repos/{owner}/{repo}/dispatches', {
                owner: 'engagementlab',
                repo: repoName,
                event_type: 'deploy-prod',
            });
        
            
            // If dispatch to trigger workflow succeeded, get all action runs and pull latest ID, send
            if(dispatchResponse.status === 204) {
            
                try { 

                    const workflowResponse = await requestWithAuth('GET /repos/{owner}/{repo}/actions/runs?event=repository_dispatch', {
                        owner: 'engagementlab',
                        repo: repoName,
                    });
                    
                    if(workflowResponse.status === 204) {
                        res.status(200).send({
                            repo: repoName,
                            id: workflowResponse.data.workflow_runs[0].id,
                        });
                    }
                    else {
                        res.status(500).send({
                            err: true,
                            msg: workflowError,
                        });
                    }

                }
                catch(e) {
                    res.status(500).send({
                        err: true,
                        msg: workflowError,
                    });
                }
         
            }    
        }    
        catch(e) {
            res.status(500).send({
                err: 'There was a problem',
                msg: `Github status: ${e.status }`,
            });
        }
    },

};