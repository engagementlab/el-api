/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Home
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Text,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');
const ContentRefreshHook = require('../refreshHook');

const Home = cloudinary => {
    /**
     * Model Fields
     * @memberof Home
     */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Home Page',
            access: false,
            isRequired: true,
        },
        intro: {
            type: Markdown,
            isRequired: true,
        },
        about: {
            type: Markdown,
            isRequired: true,
        },
        partners: {
            type: Markdown,
            isRequired: true,
        },
        facebook: {
            type: Markdown,
            isRequired: true,
        },
    };

    /**
     * Model Options
     * @memberof Home
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'Home Page',
        plural: 'Home',
        singular: 'MIM Home',
        path: 'home',
        listQueryName: 'MimHomePages',
        itemQueryName: 'MimHomePage',
        adminConfig: {
            defaultColumns: 'label',
        },
        access: {
            create: false,
            delete: false,
        },
    };
    const hooks = {
        // used to force-refresh Gatsby content model on all changes
        beforeChange: ContentRefreshHook,
    };

    return {
        hooks,
        fields,
        options,
    };
};

/**
 * Model Registration
 */
module.exports = Home;