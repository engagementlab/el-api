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
            type: Boolean,
            label: 'Enabled',
            note: 'Will never appear on site if not enabled',
        },
        title: {
            type: String,
            label: 'Title',
            required: true,

            index: true,
            note: 'Will appear before the job description',
        },
        description: {
            type: Markdown,
            label: 'Description',
            required: true,

            note: 'This is the full description, including any and all relevant information about the job or its requirements',
        },
        url: {
            type: Url,
            label: 'Application URL',
            note: 'Link to Emerson job posting. Must be in format "http://www.something.org".',
            required: true,

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