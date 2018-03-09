// @flow

import {Connection, createConnection} from 'mysql'
import * as config from '../config.json'
import {error} from '../util/utils';

export default class MySqlClient {
    conn: Connection;
    table: string;

    constructor(table: string) {
        this.table = table;
        this.conn = createConnection({
            socketPath: config.CSQL_HOST,
            user: config.CSQL_USER,
            password: config.CSQL_PASS,
            database: config.CSQL_DB
        }, e => {
            throw error(`error connecting to db`, e);
        });
        this.conn.connect();
        console.log(`connection established to table ${table}`);
    }

    select(where: string, whereArgs: Array<mixed>): Promise<*> {
        return this._query(`select * from ${this.table} where ${where}`, whereArgs)
            .catch(e => {
                throw error(`error while selecting from ${this.table}`, e);
            });
    }

    insert(values: Object): Promise<*> {
        return this._query(`insert into ${this.table} set ?`, values)
            .catch(e => {
                throw error(`error while inserting to ${this.table}`, e);
            });
    }

    update(values: Object, w: string, wA: Array<any>): Promise<*> {
        return this._query(`update ${this.table} set ? where ${this._where(w, wA)}`, values)
            .catch(e => {
                throw error(`error while updating ${this.table}`, e);
            });
    }

    delete(w: string, wA: Array<any>): Promise<*> {
        return this._query(`delete ${this.table} where ${this._where(w, wA)}`)
            .catch(e => {
                throw error(`error while deleting from ${this.table}`, e);
            });
    }

    end() {
        console.log(`ending connection of table ${this.table}`);
        this.conn.end();
    }

    _query(q: string, values: ?any): Promise<*> {
        return new Promise((resolve, reject) => {
            if (values) {
                this.conn.query(q, values, (e, results) => {
                    if (e) reject(e);
                    else resolve(results);
                });
            } else {
                this.conn.query(q, (e, results) => {
                    if (e) reject(e);
                    else resolve(results);
                });
            }
        });
    }

    _where(w: string, wA: Array<any>): string {
        let i = 0;
        return w.replace(/\?/g, () => {
            if (i >= wA.length)
                error(`where ? amount exceed where arguments length on ${w} with ${wA.join(',')}`);
            if (typeof wA[i] === 'number')
                return wA[i++].toString();
            else return `'${wA[i++].toString()}'`;
        });
    }
}