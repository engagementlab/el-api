/**
 * Engagement Lab Content and Data API
 *
 * About page Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
  Text,
  Relationship
} = require('@keystonejs/fields');

const About = (cloudinary) => {
  /**
   * Model Fields
   * @memberof About
   */
  const fields = {
    name: {
      type: String,
      default: 'About Page',
      hidden: true,
      isRequired: true,
      initial: true,
    },
    tagline: {
      type: String,
      isRequired: true,
      initial: true
    },
    missionStatement: {
      type: String,
      label: 'Mission Statement',
      isRequired: true,
      initial: true,
      isMultiline: true,
    },

    summary1: {
      type: Text,
      label: 'Summary Paragraph 1',
      isRequired: true,
      isMultiline: true,
      note: 'First (required) paragraph',
    },
    summary2: {
      type: Text,
      label: 'Summart Paragraph 2',
      isRequired: true,
      isMultiline: true,
      note: 'Second (required) paragraph',
    },

    research: {
      type: Text,
      label: 'Research Text',
      isRequired: true
    },
    workshops: {
      type: Text,
      label: 'Workshops Text',
      isRequired: true
    },
    tools: {
      type: Text,
      label: 'Tools Text',
      isRequired: true
    },
    teaching: {
      type: Text,
      label: 'Teaching Text',
      isRequired: true
    },
    design: {
      type: Text,
      label: 'Design Text',
      isRequired: true
    },

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
  return {
    fields,
    options,
  };
};

/**
 * Model Registration
 */
module.exports = About;