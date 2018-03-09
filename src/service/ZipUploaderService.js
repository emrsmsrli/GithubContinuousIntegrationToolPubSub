// @flow

import File from '../core/file';
import {error} from "../util/utils";
import GStorage from '../core/gstorageClient'
import GithubPushRepository from '../repository/githubPushRepository'

let err: Error;

export default function zus(file: File, subId: number): Promise<*> {
    const gstorage = new GStorage();
    const gpr = new GithubPushRepository();
    const path = file.path();
    return gstorage.upload(path)
        .then(remoteLink => {
            return gpr.updatePush('DONE', remoteLink, subId);
        }).catch(e => {
            gpr.updatePush('FAILED', '', subId).then(() => {
                err = error(`error while uploading file ${path}`, e);
            });
        }).then(() => {
            gpr.close();
            file.unlink();
            if (err) throw err;
        });
}