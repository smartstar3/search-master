import Vue from 'vue'
import browseApi, { prepareProducts } from '@/services/browse-api'
import router from '@/router/browse/router'

import {
    SORT_BY_OPTIONS,
    validateDateAdded,
    validateSortBy,
    DATE_ADDED_OPTIONS,
    SORT_BY_DEFAULT_VALUE,
    SORT_BY_PEOPLE_I_FOLLOW,
    SORT_BY_RECENTLY_VIEWED,
    DATE_ADDED_DEFAULT_VALUE,
    DATE_ADDED_HEADER_LABELS,
} from '@/store/filter-meta'

import {
    CATEGORY_RESOLUTION_DEFAULT_SLUG,
    CATEGORY_VERSION_BY_SLUG,
    CATEGORY_VERSION_DEFAULT_SLUG,

    freshCategoryFilters,

    RESOLUTION_BY_SLUG,
} from '@/store/category-repo'

import {
    categoryResolutionBySlugOrFail,
    categoryVersionBySlugOrFail,

    isValidCategorySlug,
    isValidSubCategorySlug,

    validateCategoryHasBpms,
    validateCategoryHasDurations,
    validateCategorySlug,
    validateCollectionId,
    validateProductId,
    validateSubCategorySlug

} from '@/store/store-validators'

import { isValidBPM, prepareDuration } from '@/store/numeric-input-helper'
import urlToState from '@/store/url-to-state'
import stateToUrl from '@/store/state-to-url'
import { arrayAdd, arrayContains, arrayRemove, arraySortBy } from '@/utilities/array'
import { makeCollection } from '@/store/models/collection'
import { stateToApiRequest } from '@/store/state-to-api-request'
import { getCache, setCache } from '@/services/local-storage'
import { mapSimpleGetters } from '@/utilities/vuex-helpers'

export default {
    // stateshould only be referenced inside mutations, actions, and getters
    : {
        sortBy: SORT_BY_DEFAULT_VALUE,
        dateAdded: DATE_ADDED_DEFAULT_VALUE,

        categoryFilters: freshCategoryFilters(),

        searchTags: [],
        collections: {},
        optionalWords: [],
        excludeProductIds: [],

        products: {},

        loading: false,

        productsCurrentPage: 1,
        productsPerPage: 60,
        productsLastPage: 10,
        productsTotalResults: 100,

        userLoggedIn: false,

        siteTotalProductsCount: 0,
        loginRegisterModalActive: false,
    },
    // should only be referenced inside actions
    mutations: {
        setSiteTotalProductsCount(state, count) {
            state.siteTotalProductsCount = count
        },
        setSortBy(state, slug) {
            validateSortBy(slug)
            state.sortBy = slug
        },

        setDateAdded(state, slug) {
            validateDateAdded(slug)
            state.dateAdded = slug
        },

        addCategorySlug(state, categorySlug) {
            validateCategorySlug({ state, categorySlug })
            state.categoryFilters[categorySlug].selected = true
        },

        removeCategorySlug(state, categorySlug) {
            validateCategorySlug({ state, categorySlug })

            state.categoryFilters[categorySlug].selected = false
            let subCategories = state.categoryFilters[categorySlug].subCategories
            Object.keys(subCategories)
                .forEach((subCategorySlug) => {
                    subCategories[subCategorySlug].selected = false
                })
        },

        addSubCategorySlug(state, { categorySlug, subCategorySlug }) {
            validateSubCategorySlug({ state, categorySlug, subCategorySlug })

            state.categoryFilters[categorySlug].selected = true
            state.categoryFilters[categorySlug].subCategories[subCategorySlug].selected = true
        },

        removeSubCategorySlug(state, { categorySlug, subCategorySlug }) {
            validateSubCategorySlug({ state, categorySlug, subCategorySlug })
            state.categoryFilters[categorySlug].subCategories[subCategorySlug].selected = false
        },

        setCategoryResolutionSlug(state, { categorySlug, resolutionSlug, selectCategory = false }) {
            let resolution = categoryResolutionBySlugOrFail({ state, categorySlug, resolutionSlug })

            let isDefault = (resolution.slug === CATEGORY_RESOLUTION_DEFAULT_SLUG)
            if (!isDefault && selectCategory) {
                state.categoryFilters[categorySlug].selected = true
            }

            state.categoryFilters[categorySlug].resolution = resolution
        },

        setCategoryVersionSlug(state, { categorySlug, versionSlug, selectCategory = false }) {
            let version = categoryVersionBySlugOrFail({ state, categorySlug, versionSlug })

            let isDefault = (version.slug === CATEGORY_VERSION_DEFAULT_SLUG)
            if (!isDefault && selectCategory) {
                state.categoryFilters[categorySlug].selected = true
            }
            state.categoryFilters[categorySlug].version = version
        },

        removeCategoryBpm(state, { categorySlug, value }) {
            validateCategoryHasBpms({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            arrayRemove(category.bpms, value)
        },

        addCategoryBpm(state, { categorySlug, value, selectCategory = false }) {
            validateCategoryHasBpms({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            if (selectCategory) {
                category.selected = true
            }
            arrayAdd(category.bpms, value)
        },

        setCategoryBpms(state, { categorySlug, values }) {
            validateCategoryHasBpms({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            category.bpms = values
        },

        removeCategoryDuration(state, { categorySlug, value }) {
            validateCategoryHasDurations({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            arrayRemove(category.durations, value)
        },

        addCategoryDuration(state, { categorySlug, value, selectCategory = false }) {
            validateCategoryHasDurations({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            if (selectCategory) {
                category.selected = true
            }
            arrayAdd(category.durations, value)
        },

        setCategoryDurations(state, { categorySlug, values }) {
            validateCategoryHasBpms({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            category.durations = values
        },

        setExcludeProductIds(state, productIds) {
            state.excludeProductIds = productIds
        },

        setProducts(state, { products, currentPage, lastPage, totalResults, perPage }) {
            state.products = products
            state.productsCurrentPage = parseInt(currentPage, 10)
            state.productsLastPage = parseInt(lastPage, 10)
            state.productsTotalResults = parseInt(totalResults, 10)
            state.productsPerPage = parseInt(perPage, 10)
        },

        setProductsFromApi(state, { products, currentPage, lastPage, totalResults, perPage }) {
            state.products = prepareProducts(products)
            state.productsCurrentPage = parseInt(currentPage, 10)
            state.productsLastPage = parseInt(lastPage, 10)
            state.productsTotalResults = parseInt(totalResults, 10)
            state.productsPerPage = parseInt(perPage, 10)
        },

        setProductsCurrentPage(state, currentPage) {
            state.productsCurrentPage = parseInt(currentPage, 10)
        },

        setProductsPerPage(state, perPage) {
            state.productsPerPage = parseInt(perPage, 10)
        },

        addSearchTag(state, value) {
            arrayAdd(state.searchTags, value)
        },

        setSearchTags(state, value) {
            // remove duplicates
            value.forEach((value) => {
                arrayAdd(state.searchTags, value)
            })
        },

        removeSearchTag(state, value) {
            arrayRemove(state.searchTags, value)
        },

        clearSearchTags(state) {
            if (!state.searchTags.length) {
                return
            }
            state.searchTags = []
        },

        setCollections(state, collections) {
            state.collections = collections
        },

        addCollection(state, { id, slug, title, productIds }) {
            let newCollection = makeCollection({
                id,
                slug,
                title,
                productIds,
            })

            Vue.set(state.collections, id, newCollection)
        },

        addProductToCollection(state, { productId, collectionId }) {
            validateCollectionId({ state, collectionId })
            validateProductId({ state, productId })

            let productIds = state.collections[collectionId].productIds
            arrayAdd(productIds, productId)
        },

        removeProductFromCollection(state, { productId, collectionId }) {
            validateCollectionId({ state, collectionId })
            validateProductId({ state, productId })

            let productIds = state.collections[collectionId].productIds
            arrayRemove(productIds, productId)
        },

        setUserMeta(state, { userLoggedIn }) {
            state.userLoggedIn = userLoggedIn
        },

        setFilterDefaults(state) {
            state.sortBy = SORT_BY_DEFAULT_VALUE
            state.dateAdded = DATE_ADDED_DEFAULT_VALUE
            state.categoryFilters = freshCategoryFilters()
            state.searchTags = []
            state.excludeProductIds = []
            state.optionalWords = []
            state.productsCurrentPage = 1
        },

        setOptionalWords(state, optionalWords) {
            state.optionalWords = optionalWords
        },

        setLoading(state, value) {
            state.loading = value
        },

        setLoginRegisterModalActive(state, value) {
            state.loginRegisterModalActive = value
        }
    },
    actions: {
        setSortBy({ commit, dispatch, state }, slug) {

            let loginRequired = [
                SORT_BY_PEOPLE_I_FOLLOW,
                SORT_BY_RECENTLY_VIEWED
            ]

            if (!state.userLoggedIn && arrayContains(loginRequired, slug)) {
                commit('setLoginRegisterModalActive', true)
                return Promise.resolve()
            } else {
                commit('setSortBy', slug)
                return dispatch('filterChange')
            }
        },

        setDateAdded({ commit, dispatch }, slug) {
            commit('setDateAdded', slug)
            return dispatch('filterChange')
        },

        setCategory({ state, commit, dispatch }, { categorySlug, value }) {
            if (value) {
                commit('addCategorySlug', categorySlug)
            } else {
                commit('removeCategorySlug', categorySlug)
            }

            return dispatch('filterChange')
        },

        setSubCategory({ state, commit, dispatch }, { categorySlug, subCategorySlug, value }) {
            if (value) {
                commit('addSubCategorySlug', { categorySlug, subCategorySlug })
            } else {
                commit('removeSubCategorySlug', { categorySlug, subCategorySlug })
            }
            return dispatch('filterChange')
        },

        setCategoryResolution({ commit, dispatch }, { categorySlug, resolutionSlug, selectCategory = false }) {
            commit('setCategoryResolutionSlug', { categorySlug, resolutionSlug, selectCategory })
            return dispatch('filterChange')
        },

        setCategoryVersion({ commit, dispatch }, { categorySlug, versionSlug, selectCategory = false }) {
            commit('setCategoryVersionSlug', { categorySlug, versionSlug, selectCategory })
            return dispatch('filterChange')
        },

        removeCategoryBpm({ state, getters, commit, dispatch }, { categorySlug, value }) {
            validateCategoryHasBpms({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]

            if (!arrayContains(category.bpms, value)) {
                return Promise.resolve()
            }

            commit('removeCategoryBpm', { categorySlug, value })
            return dispatch('filterChange')
        },

        addCategoryBpm({ state, getters, commit, dispatch }, { categorySlug, value, selectCategory = false }) {
            validateCategoryHasBpms({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]

            if (arrayContains(category.bpms, value)) {
                return Promise.resolve()
            }

            if (!isValidBPM(value)) {
                return Promise.resolve()
            }

            commit('addCategoryBpm', { categorySlug, value, selectCategory })
            return dispatch('filterChange')
        },

        removeCategoryDuration({ state, getters, commit, dispatch }, { categorySlug, value }) {
            validateCategoryHasDurations({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            value = prepareDuration(value)

            let invalid = value === false
            if (invalid) {
                return Promise.resolve()
            }

            if (!arrayContains(category.durations, value)) {
                return Promise.resolve()
            }

            commit('removeCategoryDuration', { categorySlug, value })
            return dispatch('filterChange')
        },

        addCategoryDuration({ state, getters, commit, dispatch }, { categorySlug, value, selectCategory = false }) {
            validateCategoryHasDurations({ state, categorySlug })
            let category = state.categoryFilters[categorySlug]
            value = prepareDuration(value)

            let invalid = value === false
            if (invalid) {
                return Promise.resolve()
            }

            if (arrayContains(category.durations, value)) {
                return Promise.resolve()
            }

            commit('addCategoryDuration', { categorySlug, value, selectCategory })
            return dispatch('filterChange')
        },

        addSearchTag({ state, commit, dispatch }, value) {
            value = value.trim()
            if (arrayContains(state.searchTags, value)) {
                return Promise.resolve()
            }
            commit('addSearchTag', value)
            return dispatch('filterChange')
        },

        removeSearchTag({ state, commit, dispatch }, value) {
            value = value.trim()
            if (!arrayContains(state.searchTags, value)) {
                return Promise.resolve()
            }
            commit('removeSearchTag', value)
            return dispatch('filterChange')
        },

        clearSearchTags({ state, commit, dispatch }) {
            if (!state.searchTags.length) {
                return Promise.resolve()
            }
            commit('clearSearchTags')
            return dispatch('filterChange')
        },

        fetchCollections({ commit }) {
            return browseApi.getCollections()
                .then((collections) => {
                    commit('setCollections', collections)
                })
                .catch((error) => {
                    // @TODO notify user of error
                    throw error
                })
        },

        setProducts({ commit }, { products, currentPage, lastPage, totalResults }) {
            commit('setProducts', { products, currentPage, lastPage, totalResults })
            return Promise.resolve()
        },

        setProductsFromApi({ commit }, { products, currentPage, lastPage, totalResults }) {
            commit('setProductsFromApi', { products, currentPage, lastPage, totalResults })
            return Promise.resolve()
        },

        setProductsCurrentPage({ dispatch }, currentPage) {
            return dispatch('filterChange', currentPage)
        },

        setProductsPerPage({ commit, dispatch }, perPage) {
            commit('setProductsPerPage', perPage)
            return dispatch('filterChange')
        },

        addProductToCollection({ commit, state }, { productId, collectionId }) {
            return browseApi.addToCollection({ productId, collectionId })
                .then(() => {
                    commit('addProductToCollection', { productId, collectionId })
                })
                .catch((error) => {
                    // @TODO notify user of error
                    throw error
                })
        },

        removeProductFromCollection({ commit, state }, { productId, collectionId }) {
            return browseApi.removeFromCollection({ productId, collectionId })
                .then(() => {
                    commit('removeProductFromCollection', { productId, collectionId })
                })
                .catch((error) => {
                    // @TODO notify user of error
                    throw error
                })
        },

        createNewCollectionWithProduct({ commit, state }, { productId, collectionTitle }) {
            return browseApi.createAndAddToCollection({ productId, collectionTitle })
                .then(({ id, slug, title }) => {

                    commit('addCollection', {
                        id,
                        slug,
                        title,
                        productIds: [productId]
                    })
                })
                .catch((error) => {
                    // @TODO notify user of error
                    throw error
                })
        },

        setUserMeta({ commit, dispatch }, { userLoggedIn }) {
            commit('setUserMeta', { userLoggedIn })
            if (userLoggedIn) {
                return dispatch('fetchCollections')
            }
            return Promise.resolve()
        },

        setOptionalWords({ commit, dispatch }, optionalWords) {
            commit('setOptionalWords', optionalWords)
            return dispatch('filterChange')
        },

        setLoginRegisterModalActive({ commit }, value) {
            commit('setLoginRegisterModalActive', value)
            return Promise.resolve()
        },

        setStateFromRoute({ dispatch }, route) {

            let categorySlug = route.params.category
            let subCategorySlug = route.params.subCategory

            dispatch('setStateFromUrl', {
                categorySlug,
                subCategorySlug,
                url: route.fullPath
            })
        },

        setStateFromUrl({ commit, dispatch, state }, { categorySlug, subCategorySlug, url }) {
            let newState = urlToState(url)

            commit('setFilterDefaults')

            if (state.productsCurrentPage !== newState.productsCurrentPage) {
                commit('setProductsCurrentPage', newState.productsCurrentPage)
            }

            if (state.dateAdded !== newState.dateAdded) {
                commit('setDateAdded', newState.dateAdded)
            }

            if (state.sortBy !== newState.sortBy) {
                commit('setSortBy', newState.sortBy)
            }
            if (newState.searchTags.length) {
                commit('setSearchTags', newState.searchTags)
            }

            Object.values(state.categoryFilters)
                .forEach(category => {
                    let newCategoryFilters = newState.categoryFilters || {}
                    let newCategory = newCategoryFilters[category.slug] || {}
                    let newSubCategories = newCategory.subCategories || {}

                    if (newCategory.selected) {
                        commit('addCategorySlug', category.slug)
                    }

                    if (newCategory.hasBpms) {
                        if (newCategory.bpms.length) {
                            commit('setCategoryBpms', {
                                categorySlug: category.slug,
                                values: newCategory.bpms
                            })
                        }
                        if (newCategory.durations.length) {
                            commit('setCategoryDurations', {
                                categorySlug: category.slug,
                                values: newCategory.durations
                            })
                        }
                    }

                    if (newCategory.hasVersions) {
                        if (category.version.slug !== newCategory.version.slug) {
                            commit('setCategoryVersionSlug', {
                                categorySlug: category.slug,
                                versionSlug: newCategory.version.slug
                            })
                        }
                        ``
                    }

                    if (newCategory.hasResolutions) {
                        if (category.resolution.slug !== newCategory.resolution.slug) {
                            commit('setCategoryResolutionSlug', {
                                categorySlug: category.slug,
                                resolutionSlug: newCategory.resolution.slug
                            })
                        }
                    }

                    Object.values(category.subCategories)
                        .forEach(subCategory => {
                            let newSubCategory = newSubCategories[subCategory.slug] || {}

                            if (newSubCategory.selected) {
                                commit('addSubCategorySlug', {
                                    categorySlug: category.slug,
                                    subCategorySlug: subCategory.slug
                                })
                            }
                        })
                })

            if (isValidCategorySlug({ state, categorySlug })) {
                commit('addCategorySlug', categorySlug)
            }
            if (isValidSubCategorySlug({ state, categorySlug, subCategorySlug })) {
                commit('addSubCategorySlug', { categorySlug, subCategorySlug })
            }

            return dispatch('fetch')
        },

        fetch({ commit, state }) {
            let request = stateToApiRequest(state)
            // this is also checked for back end caching here laravel/app/Services/Algolia/AlgoliaSearchRequest.php
            let hasUserSpecificFilters = arrayContains(request.filters, SORT_BY_PEOPLE_I_FOLLOW) || arrayContains(request.filters, SORT_BY_RECENTLY_VIEWED)

            let cacheKey = router.history.current.fullPath
            if (!hasUserSpecificFilters) {
                if (!cacheKey || cacheKey == '/') {
                    cacheKey = window.location.pathname
                }
                let cached = getCache(cacheKey)
                if (cached) {
                    commit('setProducts', cached)
                    return Promise.resolve()
                }
            }

            commit('setLoading', true)

            return browseApi.getProducts(request)
                .then(({ products, currentPage, lastPage, totalResults, perPage, optionalWords }) => {

                    if (!hasUserSpecificFilters) {
                        setCache(cacheKey, { products, currentPage, lastPage, totalResults, perPage, optionalWords })
                    }

                    commit('setProducts', {
                        products,
                        currentPage,
                        lastPage,
                        totalResults,
                        perPage,
                        optionalWords,
                    })

                    commit('setLoading', false)
                })
                .catch((error) => {
                    commit('setLoading', false)

                    // @TODO notify user of error
                    throw error
                })
        },
        filterChange({ dispatch }, newCurrentPage = 1) {
            return dispatch('fetch')
        }
    },
    getters: {
        ...mapSimpleGetters([
            'productsCurrentPage',
            'productsLastPage',
            'categoryFilters',
            'products',
            'sortBy',
            'dateAdded',
            'searchTags',
            'userLoggedIn',
            'collections',
            'loading',
            'siteTotalProductsCount',
            'loginRegisterModalActive',
        ]),
        productsCount(state) {
            return Object.values(state.products).length
        },
        sortedProducts(state) {
            let products = Object.values(state.products)

            return arraySortBy(products, (product) => {
                return product.displayOrder
            })
        },
        resolutions() {
            return RESOLUTION_BY_SLUG
        },
        sortByOptions() {
            return SORT_BY_OPTIONS
        },
        dateAddedOptions() {
            return DATE_ADDED_OPTIONS
        },
        apiUrl(state) {
            let request = stateToApiRequest(state)
            return stateToUrl(request)
        },
        singleCategory(state) {
            let selected = Object.values(state.categoryFilters)
                .filter((category) => {
                    return category.selected
                })

            if (selected.length === 1) {
                return selected[0]
            }
        },
        singleSubCategory(state, getters) {
            let category = getters.singleCategory
            if (!category) {
                return
            }

            let selected = Object.values(category.subCategories)
                .filter((subCategory) => {
                    return subCategory.selected
                })

            if (selected.length === 1) {
                return selected[0]
            }
        },
        dateAddedLabel(state) {
            return DATE_ADDED_HEADER_LABELS[state.dateAdded]
        },
        // getters that require arguments are prefixed with 'get'
        getCategoryVersion(state) {
            return (categorySlug) => {
                validateCategorySlug({ state, categorySlug })
                return state.categoryFilters[categorySlug].version
            }
        },
        getCategoryVersionOptions(state) {
            return (categorySlug) => {
                validateCategorySlug({ state, categorySlug })
                return CATEGORY_VERSION_BY_SLUG[categorySlug]
            }
        },
        getSubCategoryCount(state) {
            return (categorySlug) => {
                validateCategorySlug({ state, categorySlug })
                let subCategories = state.categoryFilters[categorySlug].subCategories
                let count = 0

                Object.values(subCategories)
                    .forEach((subCategory) => {
                        if (subCategory.selected) {
                            count++
                        }
                    })
                return count
            }
        },
        getProductCollections(state) {
            return (productId) => {
                productId = parseInt(productId, 10)
                validateProductId({ state, productId })

                return Object.values(state.collections)
                    .filter(collection => {
                        return arrayContains(collection.productIds, productId)
                    })
            }
        }
    },
}
