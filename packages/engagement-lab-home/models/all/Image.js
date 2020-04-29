/**
 * Engagement Lab Content and Data API
 *
 * Image
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
  CloudinaryImage
} = require('@keystonejs/fields');

const Image = (cloudinary) => {
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
      adminDoc: 'el-home-img',
    },
    // TODO: Custom multi-image field
    image: {
      type: CloudinaryImage,
      adapter: cloudinary,
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