import axios from 'axios'
import debounce from 'awesome-debounce-promise'

import { keyBy } from '@/utilities/array'
import { makeCollectionFromApi } from '@/store/models/collection'
import { makeProductFromApi } from '@/store/models/product'

let token = document.head.querySelector('meta[name="_token"]')

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}

// wait for this long after last user filter change to send request to server
export const getProducts = debounce(actualGetProducts, 100)

export default {
    getProducts,
    getCollections,
    createAndAddToCollection,
    removeFromCollection,
    addToCollection
}

function actualGetProducts({ sortBy, dateAdded, categoryFilters, page, searchTags, optionalWords, perPage, excludeProductIds, filters }) {

    let request = {
        sortBy,
        dateAdded,
        categoryFilters,
        page,
        searchTags,
        optionalWords,
        perPage,
        excludeProductIds,
        filters
    }
    console.log('api request', request)

    let url = '/api/products/search'
    return axios.post(url, request)
        .then((response) => {
            let data = response.data

            let meta = data.meta
            let currentPage = parseInt(meta.current_page, 10)
            let lastPage = parseInt(meta.last_page, 10)
            let totalResults = parseInt(meta.total, 10)
            let perPage = parseInt(meta.per_page, 10)

            return {
                products: prepareProducts(data.products),
                currentPage,
                lastPage,
                totalResults,
                perPage,
            }
        })

}

export function prepareProducts(products) {
    products = products.map((product, index) => {
        return makeProductFromApi(product, index)
    })
    return keyBy(products, 'id')
}

export function getCollections() {
    let url = '/api/collections/product-ids'
    return axios.get(url)
        .then(response => {
            let collections = response.data.map(makeCollectionFromApi)
            return keyBy(collections, 'id')
        })
}

export function createAndAddToCollection({ productId, collectionTitle }) {
    let url = '/api/collections'

    return axios.post(url, {
        title: collectionTitle,
        product_id: productId,
    }).then((response) => {
        return response.data
    })
}

export function addToCollection({ productId, collectionId }) {

    let url = '/api/collections/' + collectionId + '/add'

    return axios.post(url, {
        product_id: productId,
    })
}

export function removeFromCollection({ productId, collectionId }) {

    let url = '/api/collections/' + collectionId + '/remove'

    return axios.post(url, {
        product_id: productId,
    })
}
