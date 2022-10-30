export function mapSimpleGetters(array) {
    let out = {}

    array.forEach((key) => {
        out[key] = (state) => state[key]
    })

    return out
}
