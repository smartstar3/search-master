import cloneDeep from 'lodash.clonedeep'
import {
    SORT_BY_PEOPLE_I_FOLLOW,
    SORT_BY_RECENTLY_VIEWED,
    SORT_BY_REQUESTED
} from '@/store/filter-meta'
import { CATEGORY_RESOLUTION_DEFAULT_SLUG, CATEGORY_VERSION_DEFAULT_SLUG } from '@/store/category-repo'
import { arrayContains } from '@/utilities/array'

export function stateToApiRequest(state) {
    let categoryFilters = {}
    Object.keys(state.categoryFilters)
        .forEach((categorySlug) => {
            let category = state.categoryFilters[categorySlug]

            if (categorySlug === 'free' || !category.selected) {
                return
            }
            let subCategories = {}

            Object.keys(category.subCategories)
                .forEach((subCategorySlug) => {
                    let subCategory = category.subCategories[subCategorySlug]
                    if (!subCategory.selected) {
                        return
                    }
                    subCategories[subCategorySlug] = subCategory
                })

            let version
            let resolution
            let bpms
            let durations

            if (category.version.slug !== CATEGORY_VERSION_DEFAULT_SLUG) {
                version = category.version
            }

            if (category.resolution.slug !== CATEGORY_RESOLUTION_DEFAULT_SLUG) {
                resolution = category.resolution
            }

            if (category.hasBpms) {
                bpms = category.bpms
                durations = category.durations
            }

            categoryFilters[categorySlug] = cloneDeep({
                name: category.name,
                slug: category.slug,
                version,
                resolution,
                subCategories,
                bpms,
                durations,
            })
        })

    let filters = []

    // sort by values that are actually filters
    let validFilters = [
        SORT_BY_REQUESTED,
        SORT_BY_RECENTLY_VIEWED,
        SORT_BY_PEOPLE_I_FOLLOW,
    ]

    let sortBy = state.sortBy
    if (arrayContains(validFilters, sortBy)) {
        filters.push(sortBy)
        sortBy = null
    }

    if (state.categoryFilters.free && state.categoryFilters.free.selected === true) {
        filters.push('free')
    }

    return {
        dateAdded: state.dateAdded,
        filters,
        sortBy,
        categoryFilters,
        excludeProductIds: state.excludeProductIds,
        searchTags: state.searchTags,
        perPage: state.productsPerPage,
        page: state.productsCurrentPage,
        optionalWords: state.optionalWords,
    }
}

