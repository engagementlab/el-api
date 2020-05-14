/**
 * Engagement Lab Homepage API
 *
 * @file Project model
 * @extends Listing
 * @module models
 * @author Johnny Richardson, Jay Vachon
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

// Inherit Listing fields
const Listing = require('../shared/Listing');

/**
 * Model Fields
 * @main Project
 */
const Project = cloudinary => {
    /**
     * Model Fields
     * @memberof Project
     */
    const fields = {
        enabled: {
            type: Boolean,
            label: 'Enabled',
            adminDoc: 'Determines if this project appears on the live site.',
        },
        featured: {
            type: Boolean,
            label: 'Featured',
            adminDoc: 'Determines if this project appears on the home page in the featured project slider.',
        },
        archived: {
            type: Boolean,
            label: 'Archived',
            adminDoc: 'Determines if this project appears as archived (must also be "enabled").',
        },
        customUrl: {
            type: String,
            label: 'Custom URL',
            adminDoc: 'Must be format of "projecturl". Overrides default "/projects/projectname".',
        },
        projectType: {
            type: Select,
            label: 'Type',
            options: 'Curriculum, Event, Game, Tool',
            default: 'Curriculum',
            isRequired: true,
        },
        /*                         principalInvestigator: {
                                                        type: Relationship,
                                                        ref: 'Filter',
                                                        filters: {
                                                                category: 'Person',
                                                        },
                                                        label: 'Principal Investigator(s)',
                                                        adminDoc: 'Appears on the individual project page.',
                                                        many: true,
                                                },
 */
        format: {
            type: Relationship,
            ref: 'Filter',
            filters: {
                category: 'Format',
                appears: 'Project',
            },
            label: 'Type/Format of Product(s)',
            many: true,
            adminDoc: 'What kind of project is this? Choose from below or add a Format Filter and choose \'Project\' as its destination.',
        },

        challengeTxt: {
            type: Text,
            isMultiline: true,
            label: 'Challenge',
        },
        strategyTxt: {
            type: Text,
            isMultiline: true,
            label: 'Strategy + Approach',
        },
        resultsTxt: {
            type: Text,
            isMultiline: true,
            label: 'Results',
        },

        externalLinkUrl: {
            type: Url,
            label: 'Project Website URL',
            adminDoc: 'Must be in format "http://www.something.org" <br> Appears on the individual project page.',
        },
        githubUrl: {
            type: Url,
            label: 'Github URL',
            adminDoc: 'Must be in format "http://www.something.org" <br> Appears on the individual project page.',
        },

        // Images for project page
        /*                         projectImages: {
		                                                type: CloudinaryImages,
		                                                folder: 'homepage-2.0/projects',
		                                                autoCleanup: true,
		                                                adminDoc: 'Images below/above main project info. Please use only high-quality images. To re-order, remove and upload again. **MAX of 3 images**',
		                                        },
		                                        // Resource model reference for videos
		                                        video: {
		                                                type: Relationship,
		                                                ref: 'Resource',
		                                                label: 'Project Videos',
		                                                filters: {
		                                                        type: 'video',
		                                                },

		                                        },
		                                        // Resource model reference for files
		                                        files: {
		                                                type: Relationship,
		                                                ref: 'Resource',
		                                                label: 'Project Files',
		                                                filters: {
		                                                        type: 'file',
		                                                },
		                                                many: true,
		                                                adminDoc: 'Will appear in \'Downloads\' column on individual project page if "Show Files" ticked.',
		                                        }, */
        showFiles: {
            type: Boolean,
        },

    };

    const allFields = Object.assign(Listing(cloudinary).fields, fields);
    return {
        fields: allFields,
    };
};

/**
 * Hooks
 */
/* const hooks = {

}
Project.schema.pre('save', next => {
        // Save state for post hook
        this.wasNew = this.isNew;

        // Override key w/ custom URL if defined
        if (this.customUrl && this.customUrl.length > 0) {
                this.key = this.customUrl;
        }

        next();
});

Project.schema.post('save', (doc, next) => {
        // Make a post to slack when this Project is updated
        // keystone.get('slack').Post(Project.model, this, true);

        if (process.env.SEARCH_ENABLED === true) {
                // Index doc on elasticsearch
                global.elasti.index({
                        index: 'listing',
                        type: 'project',
                        id: doc._id.toString(),
                        body: {
                                name: doc.name,
                                key: doc.key,
                                content: doc.byline,
                                description: doc.description,
                        },
                }, (err, resp, status) => {
                        if (err) console.error(err);
                });
        }
        next();
}); */

/**
 * Model Registration
 */
module.exports = Project;