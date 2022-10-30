import { getInjectedJsonOrFail } from '@/services/get-injected-json'
import { keyBy } from '@/utilities/array'


const injectedBrowseCategoryFilters = getInjectedJsonOrFail('browse_category_filters')
const { categories, resolutions } = injectedBrowseCategoryFilters

export const CATEGORY_RESOLUTION_DEFAULT_SLUG = 'all-resolutions'
export const CATEGORY_VERSION_DEFAULT_SLUG = 'all-versions'

export const CATEGORY_BY_ID = keyBy(categories, 'id')

resolutions.unshift({
    slug: CATEGORY_RESOLUTION_DEFAULT_SLUG,
    name: 'All Resolutions'
})

export const RESOLUTION_BY_SLUG = keyBy(resolutions, 'slug')
export const CATEGORY_VERSION_BY_SLUG = {}

categories.forEach(item => {
    if (item.has_versions) {
        let allVersions = {
            slug: CATEGORY_VERSION_DEFAULT_SLUG,
            name: 'All Versions'
        }
        let versions = [allVersions].concat(item.versions)

        CATEGORY_VERSION_BY_SLUG[item.slug] = keyBy(versions, 'slug')
    }
})

export function freshCategoryFilters() {
    let out = {}

    categories.forEach(category => {
        let subCategories = {}

        category.sub_categories.forEach(subCategory => {
            subCategories[subCategory.slug] = {
                name: subCategory.name,
                slug: subCategory.slug,
                selected: false,
            }
        })

        let version = {}

        if (category.has_versions) {
            version = CATEGORY_VERSION_BY_SLUG[category.slug][CATEGORY_VERSION_DEFAULT_SLUG]
        }

        out[category.slug] = {
            id: category.id,
            selected: false,
            slug: category.slug,
            name: category.name,
            shortName: category.short_name,
            subCategories,
            hasResolutions: category.has_resolutions,
            resolution: RESOLUTION_BY_SLUG[CATEGORY_RESOLUTION_DEFAULT_SLUG],
            hasVersions: category.has_versions,
            version,
            hasBpms: category.has_bpms,
            bpms: [],
            durations: [],
        }
    })

    return out
}


let legacyCategorySlugs = {}

export function setLegacyCategorySlugs(map) {
    legacyCategorySlugs = map
}

export function normalizeCategorySlug(slug) {
    if (legacyCategorySlugs[slug]) {
        return legacyCategorySlugs[slug]
    }
    return slug
}


let legacySubCategorySlugs = {}

export function setLegacySubCategorySlugs(map) {
    legacySubCategorySlugs = map
}

export function normalizeSubCategorySlug(categorySlug, slug) {
    if (
        legacySubCategorySlugs[categorySlug] &&
        legacySubCategorySlugs[categorySlug][slug]
    ) {
        return legacySubCategorySlugs[categorySlug][slug]
    }
    return slug
}
