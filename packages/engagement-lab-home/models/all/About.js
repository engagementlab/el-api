
/**
 * Engagement Lab Website v2.x
 *
 * About page Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, Relationship } = require('@keystonejs/fields');

const About = (keystone, cloudinary) => {
  /**
   * Model Fields
   * @memberof About
   */
  const fields = {
    name: {
      type: String, default: 'About Page', hidden: true, isRequired: true, initial: true,
    },
    tagline: { type: String, isRequired: true, initial: true },
    missionStatement: {
      type: String, label: 'Mission Statement', isRequired: true, initial: true, isMultiline: true,
    },

    summary1: {
      type: Text, label: 'Summary Paragraph 1', isRequired: true, isMultiline: true, note: 'First (required) paragraph',
    },
    summary2: {
      type: Text, label: 'Summart Paragraph 2', isRequired: true, isMultiline: true, note: 'Second (required) paragraph',
    },

    // TODO: Custom multi-image field
    images: {
      type: Relationship,
      label: 'Summary Images (Requires EXACTLY 2)',
      ref: 'Image',
      many: true,
    },

    research: { type: Text, label: 'Research Text', isRequired: true },
    workshops: { type: Text, label: 'Workshops Text', isRequired: true },
    tools: { type: Text, label: 'Tools Text', isRequired: true },
    teaching: { type: Text, label: 'Teaching Text', isRequired: true },
    design: { type: Text, label: 'Design Text', isRequired: true },

  };

  /**
   * Model Options
   * @memberof About
   * See: https://www.keystonejs.com/api/create-list
   */
  const options = {
    label: 'About Page',
    singular: 'About Page',
    path: 'about',
    adminConfig: {
      defaultColumns: 'label',
    },
    access: {
      create: false,
      delete: false,
    },
  };
  keystone.createList('About', { fields, ...options });
};

/**
 * Model Registration
 */
module.exports = About;
