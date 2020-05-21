const {
    File,
} = require('@keystonejs/fields');

const {
    Types: {
        ObjectId,
    },
} = require('mongoose');


class CustomFile extends File.implementation {
    constructor(path, spec) {
        super(...arguments);
    }

    async resolveInput({
        resolvedData,
        existingItem,
    }) {
        const previousData = existingItem && existingItem[this.path];
        const uploadData = resolvedData[this.path];

        // NOTE: The following two conditions could easily be combined into a
        // single `if (!uploadData) return uploadData`, but that would lose the
        // nuance of returning `undefined` vs `null`.
        // Premature Optimisers; be ware!
        if (typeof uploadData === 'undefined') {
            // Nothing was passed in, so we can bail early.
            return undefined;
        }

        if (uploadData === null) {
            // `null` was specifically uploaded, and we should set the field value to
            // null. To do that we... return `null`
            return null;
        }

        const {
            createReadStream,
            filename: originalFilename,
            mimetype,
            encoding,
        } = await uploadData;
        const stream = createReadStream();

        if (!stream && previousData) {
            // TODO: FIXME: Handle when stream is null. Can happen when:
            // Updating some other part of the item, but not the file (gets null
            // because no File DOM element is uploaded)
            return previousData;
        }

        const newId = new ObjectId();
        const {
            id,
            filename,
            _meta,
        } = await this.fileAdapter.save({
            stream,
            filename: originalFilename,
            mimetype,
            encoding,
            id: newId,
            folder: this.config.folder,
        });

        return {
            id,
            filename,
            originalFilename,
            mimetype,
            encoding,
            _meta,
        };
    }

}

module.exports = {
    Implementation: CustomFile,
    MongoIntegerInterface: File.adapters.mongoose,
    KnexIntegerInterface: File.adapters.knex,
};