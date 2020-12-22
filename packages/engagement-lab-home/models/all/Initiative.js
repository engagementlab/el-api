/**
 * Engagement Lab Homepage API
 *
 * Initiative Model
 * @module models
 * @class initiative
 * @author Johnny Richardson
 *
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

const {
    CloudinaryImage,
    Relationship,
    Slug,
    Text,
} = require('@keystonejs/fields');

const Initiative = cloudinary => {
    /**
     * Model Fields
     * @memberof Initiative
     */
    const fields = {
        name: {
            type: Text,
            label: 'Initiative Name',
            isRequired: true,

            index: true,
            adminDoc: 'This is the name or title of the directory',
        },
        description: {
            type: Text,
            isRequired: true,

            adminDoc: 'This displays next to/near the initiative name',
        },
        longDescription: {
            type: Text,
            isRequired: true,

            isMultiline: true,
            adminDoc: 'This displays on the initiative landing',
        },
        image: {
            type: CloudinaryImage,
            label: 'Initiative Image',
            folder: 'homepage-2.0/initiatives',
            adapter: cloudinary,
        },
        projects: {
            type: Relationship,
            ref: 'Project',
            label: 'Project(s)',
            adminDoc: 'Projects that are part of this initiative',
            isRequired: true,
            many: true,

        },
        key: {
            type: Slug,
        },
    };


    /**
     * Model Options
     * @memberof Initiative
     * See: https://www.keystonejs.com/api/create-list
     */
    const options = {
        access: {
            create: false,
            delete: false,
        },
    };

    return {
        fields,
        options,
    };

};

module.exports = Initiative;