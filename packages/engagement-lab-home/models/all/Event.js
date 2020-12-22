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
    Checkbox,
    Text,
    Slug,
    Url,
    DateTime,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');
const CloudinaryImage = require('../../../core/fields/CloudinaryImage');

const Event = cloudinary => {
    /**
     * Model Fields
     * @memberof Event
     */
    const fields = {

        enabled: {
            type: Checkbox,
            label: 'Enabled',
            adminDoc: 'Will never appear on site if not enabled',
        },
        name: {
            type: Text,
            isRequired: true,

            index: true,
            adminDoc: 'Name of Event',
        },
        date: {
            type: DateTime,
            label: 'Event Date',
            default: Date.now,
            isRequired: true,

            format: 'MM/DD/YYYY h:mm A',
            yearRangeFrom: 1901,
            yearRangeTo: 2018,
            yearPickerType: 'auto',
            adminDoc: 'You must specify a valid start time, or the date will not save properly.',
        },
        image: {
            type: CloudinaryImage,
            adapter: cloudinary,
            folder: 'homepage-2.0/events',
        },
        shortDescription: {
            type: Text,
            adminDoc: 'Shown on event index page. Limit 200 characters.',
            isRequired: true,

            max: 200,
        },
        description: {
            type: Markdown,
            label: 'Long Description',
            adminDoc: 'Shown on individual event page. No character limit.',
            isRequired: true,
                
        },
        eventUrl: {
            type: Url,
            label: 'Event URL',
            adminDoc: 'Must be in format "http://www.something.org".',
        },
        showButton: {
            type: Checkbox,
            label: 'Show URL link as button',
        },
        buttonTxt: {
            type: Text,
            label: 'Label text on button',
            dependsOn: {
                showButton: true,
            },
        },
        additionalURL: {
            type: Text,
            label: 'Summary Blog Post URL (current not used)',
        },
        createdAt: {
            type: DateTime,
            default: Date.now,
            noedit: true,
            hidden: true,
        },
        key: {
            type: Slug,
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