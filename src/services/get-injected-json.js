export function getInjectedJsonOrFail(key) {
    let APP_DATA = appData();

    if (APP_DATA[key] === undefined) {
        throw new Error('window.APP_DATA[' + key + '] is undefined')
    }

    return APP_DATA[key]
}

export function getInjectedJson(key) {
    let APP_DATA = appData();
    return APP_DATA[key]
}

function appData() {
    let APP_DATA = global.APP_DATA
    if (APP_DATA === undefined) {
        throw new Error('window.APP_DATA is not set')
    }
    return APP_DATA
}
