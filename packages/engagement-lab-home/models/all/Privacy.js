/**
 * Engagement Lab Homepage API
 *
 * @file Privacy page Model
 * @module Privacy
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    DateTime,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const Privacy = cloudinary => {
    /**
     * Model Fields
     * @memberof Privacy
     */
    const fields = {
        name: {
            type: String,
            default: 'Privacy Policy',
            hidden: true,
            isRequired: true,

        },
        content: {
            type: Markdown,
            label: 'Page Content',
            isRequired: true,

        },
        lastUpdated: {
            type: DateTime,
            hidden: true,
        },
    };

    /**
     * Model Options
     * @memberof Privacy
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'Privacy Policy',
        singular: 'Privacy Policy',
        nocreate: true,
        nodelete: true,
    };

    return {
        fields,
        options,
    };

};

/**
 * Model Registration
 */
module.exports = Privacy;