// @flow

import File from './file'
import fs from 'fs';
import request from 'request';

export default class RequestBuilder {
    opts: Object;
    pipeFile: ?File;

    constructor(url: string) {
        this.opts = {};
        this.opts.uri = url;
        this.pipeFile = undefined;
    }

    body(body: Object): RequestBuilder {
        this.opts.method = 'POST';
        this.opts.body = body;
        return this;
    }

    json(): RequestBuilder {
        this.opts.json = true;
        return this;
    }

    pipe(file: File) {
        this.pipeFile = file;
        return this;
    }

    headers(h: Object): RequestBuilder {
        this.opts.headers = h;
        return this;
    }

    build(): Promise<any> {
        console.log(`building new request with options: ${JSON.stringify(this.opts)}`);
        if (this.opts.headers && !this.opts.headers['User-Agent'])
            this.opts.headers['User-Agent'] = 'request';

        return new Promise((resolve, reject) => {
            const req = request(this.opts);
            req.on('error', e => {
                console.log(`error on http request: ${e}`);
                reject(e);
            });
            req.on('response', res => {
                if (this.pipeFile) {
                    const p = this.pipeFile.path();
                    console.log(`piping to ${p}`);
                    res.pipe(fs.createWriteStream(p));
                    resolve(this.pipeFile);
                } else {
                    resolve();
                }
            });
        });
    }
}