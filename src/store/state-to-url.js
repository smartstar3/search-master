import { DATE_ADDED_DEFAULT_VALUE, SORT_BY_DEFAULT_VALUE } from '@/store/filter-meta'
import {
    CATEGORY_RESOLUTION_DEFAULT_SLUG,
    CATEGORY_VERSION_DEFAULT_SLUG,
    freshCategoryFilters
} from '@/store/category-repo'

const baseCategoryFilters = freshCategoryFilters()

export default function stateToUrl({ dateAdded, sortBy, categoryFilters, searchTags = [], productsCurrentPage }) {
    let query = {}

    if (searchTags.length) {
        query.q = searchTags.join(',')
    }

    if (dateAdded !== DATE_ADDED_DEFAULT_VALUE) {
        query.date_added = dateAdded
    }
    if (sortBy !== SORT_BY_DEFAULT_VALUE) {
        query.sort_by = sortBy
    }

    let categories = categoriesToString(categoryFilters)

    if (categories) {
        query.categories = categories
    }

    let specs = categoriesToSpecString(categoryFilters)

    if (specs) {
        query.specs = specs
    }
    query.page = productsCurrentPage

    return '?' + Object.keys(query)
        .map((key) => {
            let value = query[key]
            return key + '=' + value
        })
        .join('&')
}

function categoriesToString(categoryFilters) {
    let categoryStrings = []

    Object.values(categoryFilters)
        .forEach((category) => {
            if (!category.selected) {
                return
            }
            let categoryString = category.slug

            let subCategorySlugs = Object.values(category.subCategories)
                .filter((subCategory) => subCategory.selected)
                .map((subCategory) => subCategory.slug)
            if (subCategorySlugs.length) {
                categoryString += ':' + subCategorySlugs.join('|')
            }

            categoryStrings.push(categoryString)
        })

    return categoryStrings.join(',')
}

function categoriesToSpecString(categoryFilters) {
    let segments = []

    Object.values(categoryFilters)
        .forEach((category) => {

            let baseCategory = baseCategoryFilters[category.slug]

            if (baseCategory.hasVersions && category.version && category.version.slug !== CATEGORY_VERSION_DEFAULT_SLUG) {
                let version = specToString({
                    categorySlug: category.slug,
                    specKey: 'version',
                    value: category.version.slug
                })

                segments.push(version)
            }
            if (baseCategory.hasResolutions && category.resolution && category.resolution.slug !== CATEGORY_RESOLUTION_DEFAULT_SLUG) {
                let resolution = specToString({
                    categorySlug: category.slug,
                    specKey: 'resolution',
                    value: category.resolution.slug
                })
                segments.push(resolution)
            }

            if (baseCategory.hasBpms) {
                if (category.bpms && category.bpms.length) {
                    let bpms = specToString({
                        categorySlug: category.slug,
                        specKey: 'bpms',
                        value: category.bpms.join('|')
                    })
                    segments.push(bpms)
                }

                if (category.durations && category.durations.length) {
                    let durations = specToString({
                        categorySlug: category.slug,
                        specKey: 'durations',
                        value: category.durations.join('|')
                    })
                    segments.push(durations)
                }
            }
        })
    return segments.join(',')
}

function specToString({ categorySlug, specKey, value }) {
    return categorySlug + '.' + specKey + ':' + value
}
