// @flow

import fs from 'fs';
import p from 'path';

export default class File {
    fullPath: string;
    name: string;

    constructor(dir: string, name: string) {
        this.name = name;
        this.fullPath = p.join(dir, name);
    }

    path(): string {
        return this.fullPath;
    }

    unlink(): void {
        fs.unlink(this.fullPath, e => {
            if (e) console.error(e);
        });
    }
}