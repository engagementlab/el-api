/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Person
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Checkbox,
    Select,
    Text,
    Url,
} = require('@keystonejs/fields');
const {
    CloudinaryImage,
} = require('../../../core/fields');

const Person = cloudinary => {
    /**
     * Model Fields
     * @memberof Person
     */
    const fields = {
        name: {
            type: Text,
            isRequired: true,
        },
        title: {
            type: Text,
        },
        category: {
            type: Select,
            options: ['research', {
                value: 'namle',
                label: 'NAMLE',
            }, 'board', 'design'],
            isRequired: true,
        },
        image: {
            type: CloudinaryImage,
            adapter: cloudinary,
            folder: 'mapping-impactful-media/img/people',
        },
        bio: {
            type: Text,
            isRequired: true,
            isMultiline: true,
        },
        website: {
            type: Url,
        },
        showOnHome: {
            type: Checkbox,
        },
    };

    /**
     * Model Options
     * @memberof Person
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'Team',
        plural: 'Team Members',
        singular: 'MIML Person',
        path: 'team',
        listQueryName: 'MimPeople',
        itemQueryName: 'MimPerson',
        adminConfig: {
            defaultColumns: 'category, title, image',
        },
    };

    return {
        fields,
        options,
    };
};

/**
 * Model Registration
 */
module.exports = Person;