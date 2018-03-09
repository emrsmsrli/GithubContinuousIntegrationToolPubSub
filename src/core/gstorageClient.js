// @flow

import Storage from '@google-cloud/storage'
import path from 'path';

export default class GStorage {
    gstorage: Storage;
    bucketName: string;

    constructor(bucketName: ?string) {
        this.gstorage = new Storage();
        if (bucketName)
            this.bucketName = bucketName;
        else this.bucketName = 'linovi';
    }

    upload(p: string): Promise<*> {
        console.log(`uploading zip from ${p}`);
        return this.gstorage.bucket(this.bucketName).upload(p, {public: true})
            .then(() => {
                return `https://storage.googleapis.com/${this.bucketName}/${path.basename(p)}`;
            });
    }
}