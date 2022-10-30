import { CATEGORY_VERSION_BY_SLUG, RESOLUTION_BY_SLUG } from '@/store/category-repo'

export function validateCollectionId({ state, collectionId }) {
    let collection = state.collections[collectionId]
    if (!collection) {
        throw new Error('invalid collection id: ' + collectionId)
    }
}

export function validateProductId({ state, productId }) {
    let product = state.products[productId]

    if (!product) {
        throw new Error('invalid product id: ' + productId)
    }
}

export function isValidCategorySlug({ state, categorySlug }) {
    return !!state.categoryFilters[categorySlug]
}

export function isValidSubCategorySlug({ state, categorySlug, subCategorySlug }) {
    let category = state.categoryFilters[categorySlug]
    if (!category) {
        return false
    }
    return !!category.subCategories[subCategorySlug]
}

export function validateCategorySlug({ state, categorySlug }) {
    let category = state.categoryFilters[categorySlug]
    if (!category) {
        throw new Error('invalid category slug: ' + categorySlug)
    }
    return category
}

export function validateSubCategorySlug({ state, categorySlug, subCategorySlug }) {
    let category = validateCategorySlug({ state, categorySlug })
    if (!category.subCategories[subCategorySlug]) {
        throw new Error('invalid sub category slug: ' + subCategorySlug + ', for category slug:' + categorySlug)
    }
}

export function categoryResolutionBySlugOrFail({ state, categorySlug, resolutionSlug }) {
    let category = validateCategorySlug({ state, categorySlug })
    if (!category.hasResolutions) {
        throw new Error('category slug: ' + categorySlug + ' does not have resolutions')
    }
    let resolution = RESOLUTION_BY_SLUG[resolutionSlug]
    if (!resolution) {
        throw new Error('resolution slug: ' + resolutionSlug + ' is invalid')
    }
    return resolution
}

export function categoryVersionBySlugOrFail({ state, categorySlug, versionSlug }) {
    let category = validateCategorySlug({ state, categorySlug })
    if (!category.hasVersions) {
        throw new Error('category slug: ' + categorySlug + ' does not have versions')
    }
    let version = CATEGORY_VERSION_BY_SLUG[categorySlug][versionSlug]
    if (!version) {
        throw new Error('version slug: ' + versionSlug + ' is invalid for category slug: ' + categorySlug)
    }
    return version
}

export function validateCategoryHasBpms({ state, categorySlug }) {
    let category = validateCategorySlug({ state, categorySlug })
    if (!category.hasBpms) {
        throw new Error('category slug: ' + categorySlug + '  does not have bpms')
    }
}

export function validateCategoryHasDurations({ state, categorySlug }) {
    let category = validateCategorySlug({ state, categorySlug })
    // this looks like a typo but it is how we currently check for duration
    if (!category.hasBpms) {
        throw new Error('category slug: ' + categorySlug + '  does not have duration')
    }
}
