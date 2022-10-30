export function keyBy(array, key) {
    let output = {}

    array.forEach(item => {
        let property = item[key]
        output[property] = item
    })

    return output
}

export function arrayContains(array, value) {
    return array.indexOf(value) !== -1
}

export function arrayAdd(array, value) {
    let index = array.indexOf(value)
    let exists = index !== -1
    if (!exists) {
        array.push(value)
    }
}

export function arrayRemove(array, value) {
    let index = array.indexOf(value)
    let exists = index !== -1
    if (exists) {
        array.splice(index, 1)
    }
}

export function arraySortBy(array, callback) {
    array.sort(function (a, b) {
        let A = callback(a)
        let B = callback(b)
        if (A < B) {
            return -1
        }
        if (A > B) {
            return 1
        }
        return 0
    })
    return array
}

export function arrayFirstSuccessOnly(array) {
    let len = array.length
    for (let i = 0; i < len; i++) {
        let callback = array[i]
        let result = callback()

        if (result) {
            return result
        }
    }
}
