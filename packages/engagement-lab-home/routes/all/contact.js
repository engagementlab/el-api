/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to send form data as email and slack post
 *
 * ==========
 */

const _ = require('underscore');
const {
    WebClient,
} = require('@slack/web-api');

const slackWeb = new WebClient(process.env.SLACK_TOKEN);

exports.send = function (req, res) {
    const subjectLine = `${process.env.NODE_ENV !== 'production' ? '(TESTING)' : ''} Partner With Us Request`;
    let body = '';
    _.each(_.keys(req.body), key => {
        body += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${req.body[key]}\n`;
    });

    const mailgun = require('mailgun-js')({
        apiKey: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    });
    const validEmail = (req.body.email !== undefined && req.body.email.length > 0);
    const data = {
        from: `<${validEmail ? req.body.email : 'noreply@elab.emerson.edu'}>`,
        to: process.env.MAILGUN_CONTACT,
        subject: subjectLine,
        text: body,
    };

    mailgun.messages().send(data, error => {
        if (error) {
            console.error(`Mailgun error: ${error}`);
            res.status(500).json({
                err: error,
            });
            return;
        }
        const msg = `${process.env.NODE_ENV !== 'production' ? '(TESTING)' : ''} A message from ${req.body.name} (${req.body.email}) was just sent to engagementlab@emerson.edu from the Partner Inquiry form with the following message:`;

        // Send slack notification
        try {
            slackWeb.chat.postMessage({
                text: '',
                channel: process.env.SLACK_CHANNEL,
                blocks: [{
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: msg,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'plain_text',
                        text: req.body.message,
                    },
                }
                ],
            });
        } catch (e) {
            console.error(`SLACK ERROR: ${e}`);
        }

        res.status(200).json({
            msg: 'Message sent.',
        });
    });
};
