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
      adminDoc: 'test-image',
    },
    // TODO: Custom multi-image field
    image: {
      type: CloudinaryImage,
      adapter: cloudinary,
    },
  };
  const options = {

    label: 'Testy Img',
    singular: 'Img',
  }
  return {
    fields,
    options,
    adapterName: 'test',
  };
};

/**
 * Model Registration
 */
module.exports = Image;