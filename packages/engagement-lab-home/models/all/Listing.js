/**
 * Engagement Lab Homepage API
 *
 * @file Listing Model inherited by project, publications 
 * @module models
 * @author Johnny Richardson, Jay Vachon
 *
 * ==========
 */

const {
    Relationship,
    CloudinaryImage,
} = require('@keystonejs/fields');

const Listing = cloudinary => {
    /**
     * Model Fields
     * @memberof Listing
     */
    const fields = {
        name: {
            type: String,
            label: 'Name',
            required: true,
            initial: true,
            index: true,
        },
        byline: {
            type: String,
            required: true,
            initial: true,
            adminDoc: 'This displays under the project/event name on its page.',
        },
        description: {
            type: String,
            required: true,
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
    };

    /**
     * Model Options
     * @memberof Listing
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        hidden: true,
        sortable: true,
        autokey: {
            path: 'key',
            from: 'name',
            unique: true,
        },
    };
    const methods = {
        safeName: () => safeString(this.name),
    };

    return {
        fields,
        options,
        methods,
    };

};
/**
 * Local Methods
 */
const safeString = str => str.toLowerCase().replace(/\s+/g, '-').replace(',', '');

/**
 * Model Registration
 */
module.exports = Listing;