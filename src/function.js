// @flow

import ZipUploaderService from './service/ZipUploaderService'
import ZipDownloaderService from './service/ZipDownloaderService'

function dropIfLongLived(event: Object): boolean {
    const eventAgeMs = Date.now() - Date.parse(event.timestamp);
    const eventMaxAgeMs = 10000;
    if (eventAgeMs > eventMaxAgeMs) {
        console.log(`Dropping event ${JSON.stringify(event.context.eventId)} with age[ms]: ${eventAgeMs}`);
        return true;
    }
    return false;
}

function getEventData(event: Object) {
    let data = Buffer.from(event.data.data, 'base64').toString();
    console.log(`event data: ${data}`);
    return JSON.parse(data);
}

export function githubPersistence(event: Object): Promise<*> {
    console.log('function version 63');

    if (dropIfLongLived(event)) {
        return Promise.reject(`Event ${JSON.stringify(event.context.eventId)} is long lived`)
    }

    const eventData = getEventData(event);
    return ZipDownloaderService(eventData)
        .then(file => {
            return ZipUploaderService(file, eventData.sub_id);
        }).catch(e => {
            console.error('persistence controller couldnt complete processing', e);
            return Promise.reject(e);
        });
}