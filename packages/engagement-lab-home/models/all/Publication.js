/**
 * Engagement Lab Homepage API
 *
 * @file Publication model
 * @extends Listing
 * @module models
 * @author Johnny Richardson, Jay Vachon
 *
 * ==========
 */

const {
    DateTime,
    Relationship,
    Text,
    Url,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

// Inherit Listing fields
const Listing = require('../shared/Listing');

const Publication = cloudinary => {
    /**
     * Model Fields
     * @main Publication
     */

    const fields = {
        title: {
            type: String,
            label: 'Title',
            isRequired: true,
            initial: true,
            index: true,
            note: 'This is the link text for article/chapter urls, and the link text to individual pages for books and guides.',
        },
        enabled: {
            type: Boolean,
            label: 'Enabled',
            note: 'Determines if this publication appears on the live site.',
        },
        indexed: {
            type: Boolean,
        },
        form: {
            type: Relationship,
            filters: {
                category: 'Format',
                appears: 'Publication',
            },
            ref: 'Filter',
            label: 'Format(s)',
            note: 'What kind of publication is this? A book? An article? Pick from here or add a new Format Filter and choose \'Publication\' for the destination.',
            isRequired: true,
            many: false,
            initial: true,
        },
        author: {
            type: String,
            label: 'Author Name(s)',
            isRequired: true,
            initial: true,
            note: 'This appears below the title.',
        },
        // This field is required in the save hook below instead of here as keystone dependsOn workaround
        blurb: {
            type: Text,
            isMultiline: true,
            label: 'Blurb Text',
            note: 'This displays beneath the title and author in the publications listing.',
        },
        description: {
            type: Markdown,
            label: 'Description Text',
            required: false,
            initial: true,
            note: 'This displays on the individual publication page under \'About\'',
        },
        context: {
            type: String,
            note: 'Where this publication appears, e.g. "Journal Of Civic Media Vol. 1 Issue 3".',
        },

        date: {
            type: DateTime,
            label: 'Publication Date',
            initial: true,
            isRequired: true,
            note: 'For Books and Guides, this displays on the individual page below the author. For Articles and Chapters, this displays in the listing next to the author.',
        },
        articleResource: {
            type: Relationship,
            ref: 'Resource',
            label: 'Article Resource',
            note: 'This is a link or file.',
        },
        purchaseUrls: {
            type: String,
            label: 'Link to view publication',
            note: 'Must be in format "http://www.something.org"',
        },
        downloadUrls: {
            type: String,
            label: 'Link to download publication',
            note: 'Must be in format "http://www.something.org"',
        },
        /*         file: {
            type: File,
            label: 'File',
            note: 'If uploaded, a downloadable link to the book or guide will be appear on the publication\'s individual page.',
            storage: azureFile,
        },
 */
        isArticle: {
            type: Boolean,
            hidden: true,
            noedit: true,
            default: false,
        },
    };

    const allFields = Object.assign(Listing(cloudinary).fields, fields);

    return {
        fields: allFields,
    };
};

/**
 * Hooks
 * =============
 */
/* Publication.schema.pre('save', next => {
    // Save state for post hook
    this.wasNew = this.isNew;
    // this.wasModified = this.isModified();

    const pub = this;
    filter.model.findFilter(this.form, (err, result) => {
        if (result.key === 'article-chapter') pub.isArticle = true;
        else pub.isArticle = false;

        next(err);
    });
});

Publication.schema.post('save', (doc, next) => {
    if (process.env.SEARCH_ENABLED === true) {
        // Get type of pub
        filter.model.findFilter(doc.form, (err, result) => {
            // Index doc on elasticsearch
            global.elasti.index({
                index: 'publication',
                type: result.key,
                id: doc._id.toString(),
                body: {
                    name: doc.title,
                    key: doc.key,
                    content: doc.blurb,
                    author: doc.author,
                    description: doc.description,
                },
            }, (err, resp, status) => {
                console.log(resp, status);
                if (err) console.error(err);

                next(err);
            });
        });
    }

    next();
}); */

/**
 * Model Registration
 */
module.exports = Publication;