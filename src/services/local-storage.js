import LZString from 'lz-string'

let cacheKeys = []

const VERSION = 3
const PREFIX = 'ma-browse-v-'
const KEY_PREFIX = PREFIX + VERSION

const MAX_CACHE_KEYS = 50
const MAX_CACHE_TIME_TO_LIVE_MINUTES = 5

let enabled = true

export function enableCache(value) {
    enabled = value
}

export function setCache(key, value) {
    if (!enabled) {
        return
    }
    cacheKeys = removeExpired(cacheKeys)

    while (cacheKeys.length >= MAX_CACHE_KEYS) {
        let key = cacheKeys.shift()
        localStorageRemove(key)
    }

    cacheKeys.push(key)

    localStorageSet(key, makeCacheItem(value))

    // console.log('localStorage used: ' + getMbUsed() + 'mb')
}

export function getCache(key) {
    if (!enabled) {
        return false
    }
    let item = localStorageGet(key)

    if (!itemValid(item)) {
        localStorageRemove(key)
        return false
    }

    // move key to end of array when used
    let index = cacheKeys.indexOf(key)
    cacheKeys.splice(index, 1)
    cacheKeys.push(key)

    return item.payload
}

export function getMbUsed() {
    let bytes = new Blob(Object.values(localStorage)).size
    return (bytes / 1024 / 1024).toFixed(2)
}

function makeCacheItem(payload) {
    return {
        cachedAt: (new Date().getTime()),
        payload
    }
}

function removeExpired(cacheKeys) {
    return cacheKeys.filter((key) => {
        let item = localStorageGet(key)

        if (itemValid(item)) {
            return true
        }

        localStorageRemove(key)
        return false
    })
}

function itemValid(item) {
    if (!item) {
        return false
    }

    if (typeof item !== 'object') {
        return false
    }

    if (!item.cachedAt || Number.isNaN(item.cachedAt)) {
        return false
    }

    return !hasExpired(item.cachedAt)
}

function localStorageSet(key, value) {
    key = KEY_PREFIX + key

    let data = JSON.stringify(value)
    data = LZString.compress(data)
    try {
        localStorage.setItem(key, data)
    } catch (e) {
        console.warn('could not successfully save the \'{' + key + ': ' + value + '}\' pair, probably because the localStorage is full.')
        console.warn(e)
    }
}

function localStorageGet(key) {
    key = KEY_PREFIX + key

    let value = false
    let item = localStorage.getItem(key)
    if (item) {
        item = LZString.decompress(item)
        try {
            value = JSON.parse(item)
        } catch (e) {
            console.warn(e)
        }
    }
    return value
}

function localStorageRemove(key) {
    key = KEY_PREFIX + key

    localStorage.removeItem(key)
}

function hasExpired(created) {
    return minutesAgo(created) > MAX_CACHE_TIME_TO_LIVE_MINUTES
}

function minutesAgo(time) {
    let milliSeconds = (new Date().getTime()) - time
    let seconds = Math.floor(milliSeconds / 1000)
    return seconds / 60
}


export function purgeOldCacheKeys() {
    let legacyPrefix = 'ma-browse-/'
    let oldPrefixes = prevVersionPrefixes(PREFIX, VERSION)
    oldPrefixes.push(legacyPrefix)

    oldPrefixes.forEach((prefix) => {
        removeMatchingPrefixKeys(prefix)
    })
}

let localStorageKeys

function getLocalStorageKeys(clearCache = false) {
    if (!localStorageKeys || clearCache) {
        localStorageKeys = Object.keys(localStorage)
    }
    return localStorageKeys
}

function removeMatchingPrefixKeys(prefix) {
    let keys = getLocalStorageKeys()
    localStorageKeys = keys.filter((key) => {
        let match = key.startsWith(prefix)
        if (match) {
            localStorage.removeItem(key)
        }
        return !match
    })
}

function prevVersionPrefixes(prefix, currentVersion) {
    let keys = []
    for (let i = currentVersion - 1; i; i--) {
        let cacheKeyPrefix = prefix + i
        keys.push(cacheKeyPrefix)
    }
    return keys
}
