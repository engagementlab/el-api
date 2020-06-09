/**
 * Engagement Lab Homepage API
 *
 * @file News Item Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    DateTime,
    Slug,
    Url,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const News = cloudinary => {
    /**
     * Model Fields
     * @memberof News
     */
    const fields = {
        title: {
            type: String,
            label: 'Title',
            isRequired: true,
            index: true,
        },
        url: {
            type: Url,
            label: 'Link to Medium Post',
            isRequired: true,

        },
        datePosted: {
            type: DateTime,
        },
        key: {
            type: Slug,
        },
    };

    /**
     * Model Options
     * @memberof News
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'News Item',
    };

    return {
        fields,
        options,
    };

};

/**
 * Model Registration
 */
module.exports = News;