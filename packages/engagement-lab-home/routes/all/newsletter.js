/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to send form data as email and slack post
 *
 * ==========
 */

const mailchimp = require('@mailchimp/mailchimp_marketing');

// eslint-disable-next-line func-names
exports.signup = async function (req, res) {
    const listId = process.env.MAILCHIMP_LIST_ID;

    mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_KEY,
        server: 'us6',
    });

    try {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: req.params.email,
            status: 'subscribed',
        });

        if (response.id) { res.status(200).send({ msg: 'ok', }); }
    } catch (e) {
        if (e.response.body.title === 'Member Exists') {
            res.status(400).send('already_subscribed');
            return;
        }

        res.sendStatus(500);
    }
};
