/**
 * Engagement Lab Homepage API
 *
 * @file Event page Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Text,
    Url,
    DateTime,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const Event = cloudinary => {
    /**
     * Model Fields
     * @memberof Event
     */
    const fields = {

        enabled: {
            type: Boolean,
            label: 'Enabled',
            adminDoc: 'Will never appear on site if not enabled',
        },
        name: {
            type: String,
            isRequired: true,
            initial: true,
            index: true,
            adminDoc: 'Name of Event',
        },
        date: {
            type: DateTime,
            label: 'Event Date',
            default: Date.now,
            isRequired: true,
            initial: true,
            format: 'MM/DD/YYYY h:mm A',
            yearRangeFrom: 1901,
            yearRangeTo: 2018,
            yearPickerType: 'auto',
            adminDoc: 'You must specify a valid start time, or the date will not save properly.',
        },
        // images: {
        //     type: Types.CloudinaryImages,
        //     label: 'Event Images',
        //     folder: 'homepage-2.0/events',
        // },
        shortDescription: {
            type: Text,
            adminDoc: 'Shown on event index page. Limit 200 characters.',
            isRequired: true,
            initial: true,
            max: 200,
        },
        // description: {
        //     type: Markdown,
        //     label: 'Long Description',
        //     adminDoc: 'Shown on individual event page. No character limit.',
        //     isRequired: true,
        //     initial: true,
        // },
        eventUrl: {
            type: Url,
            label: 'Event URL',
            adminDoc: 'Must be in format "http://www.something.org".',
        },
        showButton: {
            type: Boolean,
            label: 'Show URL link as button',
        },
        buttonTxt: {
            type: String,
            label: 'Label text on button',
            dependsOn: {
                showButton: true,
            },
        },
        additionalURL: {
            type: String,
            label: 'Summary Blog Post URL (current not used)',
        },
        createdAt: {
            type: DateTime,
            default: Date.now,
            noedit: true,
            hidden: true,
        },

    };

    /**
     * Model Options
     * @memberof Contact
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        singular: 'Event',
        autokey: {
            path: 'key',
            from: 'name',
            unique: true,
        },
        hidden: false,
    };

    return {
        fields,
        options,
    };

};

/* 
Event.schema.post('save', (doc, next) => {
    if (process.env.SEARCH_ENABLED === true) {
        // Index doc on elasticsearch
        global.elasti.index({
            index: 'event',
            type: 'event',
            id: doc._id.toString(),
            body: {
                name: doc.name,
                key: doc.key,
                content: doc.shortDescription,
            },
        }, (err, resp, status) => {
            if (err) console.error(err);
        });
    }

    next();

    next();
});
 */

/**
 * Model Registration
 */
module.exports = Event;