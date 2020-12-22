/**
 * Engagement Lab Homepage API
 *
 * @file Job Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Checkbox,
    Slug,
    Text,
    Url,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const Job = cloudinary => {
    /**
     * Model Fields
     * @memberof Job
     */
    const fields = {
        enabled: {
            type: Checkbox,
            label: 'Enabled',
            note: 'Will never appear on site if not enabled',
        },
        title: {
            type: Text,
            label: 'Title',
            isRequired: true,

            index: true,
            note: 'Will appear before the job description',
        },
        description: {
            type: Markdown,
            label: 'Description',
            isRequired: true,

            note: 'This is the full description, including any and all relevant information about the job or its requirements',
        },
        url: {
            type: Url,
            label: 'Application URL',
            note: 'Link to Emerson job posting. Must be in format "http://www.something.org".',
            isRequired: true,

        },
        key: {
            type: Slug,
        },
    };

    return {
        fields,
    };

};

/**
 * Model Registration
 */
module.exports = Job;