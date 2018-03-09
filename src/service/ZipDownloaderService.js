// @flow

import File from '../core/file'
import {error} from '../util/utils';
import GithubWebhookRepository from '../repository/githubWebhookRepository';
import RequestBuilder from '../core/networkClient'

const tmp = '/tmp';

export default function zds(eventData: Object): Promise<*> {
    const gwr = new GithubWebhookRepository();
    return gwr.getWebhook(eventData.sub_id)
        .then(rows => {
            if (rows.length < 1)
                return Promise.reject('subsciberId not found on db');
            return rows[0];
        }).then(subData => {
            const fileName = `${subData.repo_owner}_${subData.repo}_${+new Date()}.zip`;
            console.log(`generated zip filename is ${fileName}`);
            const file = new File(tmp, fileName);

            return new RequestBuilder(`https://api.github.com/repos/${subData.repo_owner}/${subData.repo}/zipball/master`)
                .headers({
                    'Authorization': 'token ' + subData.token,
                    'Accept': '*/*'
                }).pipe(file).build();
        }).catch(e => {
            throw error(`error while downloading zip for sub ${eventData.sub_id}`, e);
        }).then(file => {
            gwr.close();
            return file;
        });
}