
/**
 * Engagement Lab Website v2.x
 *
 * Image
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { CloudinaryImage } = require('@keystonejs/fields');

const Image = (keystone, cloudinary) => {
  /**
   * Model Fields
   * @memberof Image
   */
  const fields = {
    name: {
      type: String,
      default: 'Image',
      hidden: true,
      isRequired: true,
      initial: true,
      adminDoc: 'hi',
    },
    // TODO: Custom multi-image field
    image: {
      type: CloudinaryImage,
      adapter: cloudinary,
    },
  };

  keystone.createList('Image', { fields });
};

/**
 * Model Registration
 */
module.exports = Image;
