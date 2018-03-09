// @flow

import {error} from '../util/utils';
import MySqlClient from '../core/mySqlClient';

export default class GHWebhookRepo {
    mysqlGithubWebhookClient: MySqlClient;

    constructor() {
        this.mysqlGithubWebhookClient = new MySqlClient('webhook');
    }

    getWebhook(id: number): Promise<any> {
        return this.mysqlGithubWebhookClient.select('id=?', [id])
            .catch(e => {
                throw error(`couldn't get webhook from db where id is ${id}`, e);
            });
    }

    close(): void {
        this.mysqlGithubWebhookClient.end();
    }
}