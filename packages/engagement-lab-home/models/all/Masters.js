/**
 * Engagement Lab Homepage API
 *
 * @file Masters Model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
  Relationship,
  Url,
} = require('@keystonejs/fields');
const {
  Markdown,
} = require('@keystonejs/fields-markdown');

const Masters = cloudinary => {
  /**
   * Model Fields
   * @memberof Masters
   */
  const fields = {
    name: {
      type: String,
      default: 'Masters Program Page',
      hidden: true,
      isRequired: true,
    },
    programDescription: {
      type: Markdown,
      label: 'Blurb',
      note: 'This text follows logo.',
      isRequired: true,
    },
    applicationLink: {
      type: Url,
      note: 'Must be in format "http://www.something.org"',
    },
    buttonTxt: {
      type: String,
      label: 'Application link/button text',
      isRequired: true,
    },
    cohortYear: {
      type: Relationship,
      label: 'Cohort Year to display',
      ref: 'Filter',
      filters: {
        category: 'Cohort',
      },

      note: 'This field is for students and board members, and will display below the title.',
    },
  };
  /**
   * Model Options
   * @memberof Masters
   * @see https://www.keystonejs.com/api/create-list
   */
  const options = {
    label: 'Grad Program',
  };

  return {
    fields,
    options,
  };
};

/**
 * Hooks
 * =============
 Masters.schema.pre('save', next => {
	 // TODO: Implement as global md sanitizer
	 this.programDescription.html = this.programDescription.html.replace(/<p[^>]+?>|<p>|<\/p>/g, '');
	 
	 next();
	});
   */

/**
 * Model Registration
 */
module.exports = Masters;