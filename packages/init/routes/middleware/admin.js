/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Admin actions middleware
 * ==========
 */

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
        User.find({}, (err, users) => {
            res.render('admin', {
                apps: appsInfo,
                users,
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
            if (body.email && body.name) {
                User.create({
                    name: body.name,
                    email: body.email,
                    isAdmin: body.isAdmin,
                    permissions: body.permissions,
                }, (err, user) => {
                    if (err) {
                        // Catch dupe email
                        if (err.name === 'MongoError' && err.keyPattern.email === 1)
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
                    _id: body.userId,
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

};