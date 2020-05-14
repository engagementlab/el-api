/**
 * Engagement Lab Homepage API
 *
 * @file Get Involved page Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Text,
} = require('@keystonejs/fields');

const Contact = cloudinary => {
    /**
     * Model Fields
     * @memberof Contact
     */
    const fields = {
        name: {
            type: String,
            default: 'Contact/Get Involved Page',
            hidden: true,
            isRequired: true,

        },
        blurb: {
            type: String,
            label: 'Page Blurb',
            isRequired: true,

        },
        students: {
            type: Text,
            label: 'Students and Researchers Text',
            isMultiline: true,
            isRequired: true,

        },
        community: {
            type: Text,
            label: 'Community Partnerships Text',
            isMultiline: true,
            isRequired: true,

        },
    };

    /**
     * Model Options
     * @memberof Contact
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'Get Involved Page',
        singular: 'Get Involved Page',
        nodelete: true,
        nocreate: true,
    };

    return {
        fields,
        options,
    };

};

/**
 * Model Registration
 */
module.exports = Contact;