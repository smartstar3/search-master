import filterSpecs from '@/services/filter-specs'

const data = {
    browse_category_filters: filterSpecs
}
export function getInjectedJsonOrFail(key) {
    return data[key]
}
