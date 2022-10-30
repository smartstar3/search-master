import {
    CATEGORY_BY_ID,
    CATEGORY_VERSION_BY_SLUG,
    freshCategoryFilters,
    RESOLUTION_BY_SLUG
} from '@/store/category-repo'
import {
    DATE_ADDED_DEFAULT_VALUE,
    SORT_BY_DEFAULT_VALUE,
    isValidDateAdded,
    isValidSortBy,
} from '@/store/filter-meta'
import { normalizeCategorySlug, normalizeSubCategorySlug } from '@/store/category-repo'

export default function urlToState(url) {
    let query = decodeURLParams(url)
    let out = {
        sortBy: SORT_BY_DEFAULT_VALUE,
        dateAdded: DATE_ADDED_DEFAULT_VALUE,
        searchTags: []
    }

    if (isValidDateAdded(query.date_added)) {
        out.dateAdded = query.date_added
    }

    if (isValidSortBy(query.sort_by)) {
        out.sortBy = query.sort_by
    }

    let categoryFilters = freshCategoryFilters()
    out.categoryFilters = categoryFilters

    if (query.categories) {
        let urlCategories = query.categories.split(',')
        urlCategories.forEach(str => {
            let parts = str.split(':')
            let categorySlug = parts[0]
            let urlSubCategories = parts[1]

            categorySlug = normalizeCategorySlug(categorySlug)

            if (!categoryFilters[categorySlug]) {
                return
            }

            categoryFilters[categorySlug].selected = true

            if (urlSubCategories) {
                let subCategorySlugs = urlSubCategories.split('|')
                subCategorySlugs = subCategorySlugs.map((slug) => {
                    return normalizeSubCategorySlug(categorySlug, slug)
                })
                let filterSubCategories = categoryFilters[categorySlug].subCategories

                Object.values(filterSubCategories)
                    .forEach(subCategory => {
                        let exists = subCategorySlugs.indexOf(subCategory.slug) !== -1
                        if (exists) {
                            subCategory.selected = true
                        }
                    })
            }
        })
    }

    if (query.specs) {
        let specs = query.specs.split(',')
        let specObjects = specs.map(spec => specToObject(spec))

        specObjects.forEach(({ categorySlug, spec, value }) => {
            if (!categoryFilters[categorySlug]) {
                return
            }

            if (!value) {
                return
            }

            let catFilter = categoryFilters[categorySlug]
            if (catFilter.hasResolutions) {
                if (spec === 'resolution') {

                    let resolutionSlug = convertOldSpecValue(value)
                    let resolution = RESOLUTION_BY_SLUG[resolutionSlug]
                    if (resolution) {
                        catFilter.resolution = resolution
                    }
                }
            }

            if (catFilter.hasVersions) {
                if (spec === 'version') {
                    let versions = CATEGORY_VERSION_BY_SLUG[categorySlug]
                    let versionSlug = convertOldSpecValue(value)
                    let version = versions[versionSlug]
                    if (version) {
                        catFilter.version = version
                    }
                }
            }

            if (catFilter.hasBpms) {
                if (spec === 'bpms') {
                    catFilter.bpms = value.split('|').filter(v => v)
                }

                if (spec === 'durations') {
                    catFilter.durations = value.split('|').filter(v => v)
                }
            }
        })
    }

    if (query.q) {
        out.searchTags = query.q.split(',')
    }

    if (query.free) {
        out.categoryFilters['free'].selected = true
    }

    let page = parseInt(query.page, 10)
    if (isNaN(page)) {
        page = 1;
    }
    out.productsCurrentPage = page

    return out
}

function convertOldSpecValue(str) {
    let array = str.split('|')
    let filtered = array.filter(str => str !== 'none')

    if (filtered.length) {
        return filtered[filtered.length - 1]
    }
}

function specToObject(specString) {
    let parts = splitOnFirst(specString, ':')
    let key = parts.before
    let value = parts.after

    let { before, after } = splitOnLast(key, '.')
    let categorySlug = oldSpecKeyToSlug(before)
    if (!categorySlug) {
        return {}
    }

    return {
        categorySlug,
        spec: after,
        value
    }
}

function oldSpecKeyToSlug(spec) {
    let id = oldSpecKeyToId(spec)
    if (!id) {
        return spec
    }

    let category = CATEGORY_BY_ID[id]

    if (!category) {
        return false
    }
    return category.slug
}

function oldSpecKeyToId(spec) {
    let re = /(specs\.cat)(\d+)/
    let match = re.exec(spec)
    if (match && match[1] === 'specs.cat') {
        return match[2]
    }

    return false
}

function splitOnFirst(str, splitOn) {
    let before = str.substr(0, str.indexOf(splitOn))
    let after = str.substr(str.indexOf(splitOn) + 1)

    return {
        before,
        after
    }
}

function splitOnLast(str, splitOn) {
    let before = str.substring(0, str.lastIndexOf(splitOn))
    let after = str.substring(str.lastIndexOf(splitOn) + 1, str.length)

    return {
        before,
        after
    }
}

function decodeURLParams(search) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&')
    return hashes.reduce((params, hash) => {
        const split = hash.indexOf('=')

        if (split < 0) {
            return Object.assign(params, {
                [hash]: null
            })
        }

        const key = hash.slice(0, split)
        const val = hash.slice(split + 1)

        return Object.assign(params, { [key]: decodeURIComponent(val) })
    }, {})
}
