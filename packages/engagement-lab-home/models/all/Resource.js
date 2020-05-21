/**
 * Engagement Lab Homepage API
 *
 * @file Content resources/files
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    CloudinaryImage,
    CalendarDay,
    DateTime,
    File,
    Select,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const AzureAdapter = require('../../../init/adapters/Azure');

const fileAdapter = new AzureAdapter({
    accountName: process.env.AZURE_STORAGE_ACCOUNT,
    accountKey: process.env.AZURE_STORAGE_ACCESS_KEY,
    containerName: 'resources',
});

const Resource = cloudinary => {
    /**
     * Model Fields
     * @main Resource
     */
    const fields = {
        name: {
            type: String,
            label: 'Resource Name',
            isRequired: true,
            initial: true,
            index: true,
        },
        type: {
            type: Select,
            label: 'Type',
            options: ['video', 'article', 'blog post', 'file'],
            dataType: 'string',
            isRequired: true,
        },

        url: {
            type: String,
            label: 'URL',
            dependsOn: {
                type: ['video', 'article', 'blog post'],
            },
            initial: true,
        },

        summary: {
            type: String,
            label: 'Summary',
            dependsOn: {
                type: ['article', 'blog post'],
            },
        },
        date: {
            type: DateTime,
            label: 'Date Published',
            dependsOn: {
                type: ['article', 'blog post'],
            },
        },
        author: {
            type: String,
            label: 'Author',
            dependsOn: {
                type: ['article', 'blog post'],
            },
        },

        file: {
            type: File,
            label: 'File',
            adapter: fileAdapter,
        },
        fileSummary: {
            type: Markdown,
            label: 'File Summary',
            dependsOn: {
                type: ['file'],
            },
        },

        imageOverride: {
            type: CloudinaryImage,
            dependsOn: {
                type: 'article',
            },
            label: 'Image Override (350 x 233)',
            folder: 'homepage-2.0/research',
            note: 'This should be used if the image provided automatically is not acceptable.',
            autoCleanup: true,
            adapter: cloudinary,
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
// Resource.schema.pre('save', (next) => {
//   let err;

//   // Save state for post hook
//   this.wasNew = this.isNew;
//   // this.wasModified = this.isModified();

//   /*
//     If Azure file upload succeeded but returned no filename, we have to generate
//     manually and save it since keystone's createBlockBlobFromLocalFile
//     implementation does not account for Azure returning only "commmittedBlocks"
//     arrays for huge files, and not file metadata.
//     I considered submitting a fix PR for azurefile.prototype.uploadFile but I
//     will wait for keystone release ~0.0.4.

//     Using filetype as the string to obtain the file extension is not 100%
//     foolproof as it's a MIME type, but it works for most common file formats.
//   */
//   if (this.type === 'article') {
//     if (this.date !== undefined && this.date.length === 0) err = 'You must provide the date that the article was published. Sorry bub.';

//     //  if (this.summary !== undefined && this.summary.length === 0)
//     // err = ('You must define a summary for articles.');

//     // else if (this.author !== undefined && this.author.length === 0)
//     //   err = 'You must provide the name of the author who published the article.';
//   }

//   if (err !== undefined && err.length > 0) next(new Error(err));

//   next();
// });

// Resource.schema.post('save', (next) => {
//   // Make a post to slack when this Resource is updated
//   // keystone.get('slack').Post(Resource.model, this, true);

//   next();
// });

// Resource.schema.pre('remove', (next) => {
//   // Remove resource from all that referenced it
//   keystone.list('Project').model.removeResourceRef(this._id, (err, removedCount) => {
//     if (err) console.error(err);

//     if (removedCount > 0) console.log(`Removed ${removedCount} references to '${this._id}'`);

//     next();
//   });
// });

/**
 * Model Registration
 */
module.exports = Resource;