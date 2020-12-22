/**
 * Engagement Lab Homepage API
 *
 * @file Listing fields inherited by project, publications 
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Checkbox,
    CloudinaryImage,
    Relationship,
    Slug,
    Text,
} = require('@keystonejs/fields');

const safeString = str => str.toLowerCase().replace(/\s+/g, '-').replace(',', '');

const Listing = cloudinary => {
    return {
        fields: {
            name: {
                type: Text,
                label: 'Name',
                isRequired: true,

                index: true,
            },
            byline: {
                type: Text,
                isRequired: true,

                adminDoc: 'This displays under the project/event name on its page.',
            },
            description: {
                type: Text,
                isRequired: true,

            },
            image: {
                type: CloudinaryImage,
                label: 'Thumbnail Image',
                folder: 'homepage-2.0/listings',
                autoCleanup: true,
                adapter: cloudinary,
                adminDoc: 'This displays as the image/thumbnail when needed.',
            },
            indexed: {
                type: Checkbox,
                hidden: true,
            },
            key: {
                type: Slug,
            },
        },
        safeName: () => safeString(this.name),
    };
};

module.exports = Listing;