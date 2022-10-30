const timeRegex = new RegExp('^(\\d{1,3}:[0-5]\\d)$')
const numberRegex = new RegExp('^[0-9]*$')

export function isValidBPM(value) {
    return numberRegex.test(value)
}

export function prepareDuration(value) {
    let isTime = timeRegex.test(value)
    let isNumber = numberRegex.test(value)

    if (!isTime && !isNumber) {
        return false
    }

    let preparedValue = value
    if (isNumber) {
        let label = parseInt(value, 10) % 60
        if (label < 10) {
            label = '0' + label
        }
        preparedValue = Math.floor(parseInt(value, 10) / 60) + ':' + label
    }

    return preparedValue
}
