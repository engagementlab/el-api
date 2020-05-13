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
    Relationship,
    CloudinaryImage,
} = require('@keystonejs/fields');

const safeString = str => str.toLowerCase().replace(/\s+/g, '-').replace(',', '');

const Listing = cloudinary => {
    return {
        fields: {
            name: {
                type: String,
                label: 'Name',
                isRequired: true,
                initial: true,
                index: true,
            },
            byline: {
                type: String,
                isRequired: true,
                initial: true,
                adminDoc: 'This displays under the project/event name on its page.',
            },
            description: {
                type: String,
                isRequired: true,
                initial: true,
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
                type: Boolean,
                hidden: true,
            },
        },
        safeName: () => safeString(this.name),
    };
};

module.exports = Listing;