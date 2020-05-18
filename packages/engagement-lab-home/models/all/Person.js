/**
 * Engagement Lab Homepage API
 *
 * @file Person model
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    CloudinaryImage,
    Select,
    Relationship,
    Text,
    Url,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const Name = require('../../../init/fields/Name');

const Person = cloudinary => {
    /**
     * Model Fields
     * @main Person
     */
    const fields = {
        name: {
            type: Name,
            isRequired: true,
            index: true,
        },

        category: {
            type: Select,
            options: ['faculty leadership', 'advisory board', 'staff', 'faculty fellows', 'CMAP', 'Masters', 'lab assistants'],
            defaultValue: 'staff',
            dataType: 'string',
            isRequired: true,
            initial: true,
            note: 'This determines the section in which the person displays',
        },

        title: {
            type: Text,
            label: 'Title',
            dependsOn: {
                category: ['faculty leadership', 'staff', 'faculty fellows', 'lab assistants'],
            },
            initial: true,
            note: 'This appears below the name.',
        },
        cohortYear: {
            type: Relationship,
            label: 'Year',
            dependsOn: {
                category: ['CMAP', 'Masters', 'advisory board'],
            },
            ref: 'Filter',
            filters: {
                category: 'Cohort',
            },
            initial: true,
            note: 'This field is for students and board members, and will display below the title.',
        },
        project: {
            type: Markdown,
            label: 'Project Description',
            dependsOn: {
                category: ['CMAP', 'cohort', 'advisory board'],
            },
            note: 'This field is currently not shown.',
        },

        bio: {
            type: Markdown,
            label: 'Bio',
            isRequired: true,
            initial: true,
        },
        image: {
            type: CloudinaryImage,
            label: 'Image',
            folder: 'homepage-2.0/team',
            note: 'Must be in square format. Will display as 192px by 192px.',
            adapter: cloudinary,
        },

        cmapPerson: {
            type: Boolean,
            label: 'Show on CMAP page',
            // TODO: implement
            dependsOn: {
                category: ['faculty leadership', 'faculty fellows', 'CMAP'],
            },
            note: 'This field is for faculty leadership, fellows, and CMAP students to display them in the CMAP page.',
        },

        twitterURL: {
            type: Url,
            label: 'Twitter',
            note: 'This will display on the person\'s individual page',
        },
        fbURL: {
            type: Url,
            label: 'Facebook',
            note: 'This will display on the person\'s individual page',
        },
        igURL: {
            type: Url,
            label: 'Instagram',
            note: 'This will display on the person\'s individual page',
        },
        linkedInURL: {
            type: Url,
            label: 'LinkedIn',
            note: 'This will display on the person\'s individual page',
        },
        githubURL: {
            type: Url,
            label: 'Github',
            note: 'This will display on the person\'s individual page',
        },
        websiteURL: {
            type: Url,
            label: 'Website',
            note: 'This will display on the person\'s individual page',
        },

        email: {
            type: String,
            label: 'Email',
            note: 'This will display on the person\'s individual page',
        },
        phone: {
            type: String,
            label: 'Phone',
            note: 'This will display on the person\'s individual page',
        },
    };
    return {
        fields,
    };
};
/**
 * Hooks
 * =============
 */
/* Person.schema.pre('save', next => {
          // Save state for post hook
          this.wasNew = this.isNew;
          // this.wasModified = this.isModified();

          next();
        });

        Person.schema.post('save', next => {
          // Make a post to slack when this Person is updated
          // const person = this;

          // keystone.get('slack').Post(
          //   Person.model, this, true,
          //   function() { return person.name.first + ' ' + person.name.last; }
          // );

          next();
        }); */

/**
 * Model Registration
 */
module.exports = Person;