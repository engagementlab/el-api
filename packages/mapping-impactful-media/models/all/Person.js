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
    Text,
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
            defaultColumns: 'title, image',
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