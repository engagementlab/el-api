/**
 * Engagement Lab Homepage API
 *
 * Image
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const CloudinaryImage = require('../../../core/fields/CloudinaryImage');

const Image = cloudinary => {
    /**
     * Model Fields
     * @memberof Image
     */
    const fields = {
        name: {
            type: String,
            default: 'Image',
            isRequired: true,
            adminDoc: 'el-home-img',

        },
        // TODO: Custom multi-image field
        image: {
            type: CloudinaryImage,
            adapter: cloudinary,
            folder: 'test',
        },
    };
    return {
        fields,

    };
};

/**
 * Model Registration
 */
module.exports = Image;