// @flow

import {error} from '../util/utils';
import MySqlClient from '../core/mySqlClient';

export default class GHPushRepo {
    mysqlGithubPushClient: MySqlClient;

    constructor() {
        this.mysqlGithubPushClient = new MySqlClient('push');
    }

    updatePush(status: string, zipurl: string, webhookId: number): Promise<*> {
        return this.mysqlGithubPushClient.update({
            status: status,
            zip_url: zipurl
        }, '`webhook_id`=? and `status`=?', [
            webhookId, 'INPROGRESS'
        ]).then(rows => {
            return rows.changedRows;
        }).catch(e => {
            throw error(`couldn't update push on db where whId is ${webhookId}`, e);
        });
    }

    close(): void {
        this.mysqlGithubPushClient.end();
    }
}