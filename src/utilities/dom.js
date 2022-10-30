export function ifIdExists(id, callback) {
    let el = document.getElementById(id)
    if (el) {
        callback(el)
    }
    return !!el
}
