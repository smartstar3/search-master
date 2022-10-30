import { ADDED_LAST_YEAR, SORT_BY_MOST_POPULAR } from '@/store/filter-meta'

jest.mock('@/services/get-injected-json')

import { CATEGORY_VERSION_BY_SLUG, freshCategoryFilters, RESOLUTION_BY_SLUG } from '@/store/category-repo'
import storeConfig from '@/store/store-browse'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = new Vuex.Store(storeConfig)
describe('vuex store', () => {
    it('sets state from url', () => {
        const catSlug1 = 'after-effects-templates'
        const resolution = '4096x2304-4k'
        const version = 'after-effects-cs4'

        const catSlug2 = 'stock-music'

        const url = '?date_added=' + ADDED_LAST_YEAR +
            '&sort_by=' + SORT_BY_MOST_POPULAR +
            '&categories=' +
            catSlug1 + ':' +
            'logos|transitions' +
            ',' +
            catSlug2 + ':' +
            'heavy|fun|invalid' +

            '&specs=' +
            catSlug1 + '.resolution:' + resolution + ',' +
            catSlug1 + '.version:' + version + ',' +
            catSlug2 + '.bpms:3|4|5' + ',' +
            catSlug2 + '.durations:6|7|8' +
            '&page=3'

        store.dispatch('setStateFromUrl', {url})

        expect(store.getters.dateAdded).toMatch(ADDED_LAST_YEAR)
        expect(store.getters.sortBy).toMatch(SORT_BY_MOST_POPULAR)
        expect(store.getters.productsCurrentPage).toEqual(3)

        let expected = freshCategoryFilters()

        expected[catSlug1].selected = true
        expected[catSlug1].subCategories['logos'].selected = true
        expected[catSlug1].subCategories['transitions'].selected = true
        expected[catSlug1].resolution = RESOLUTION_BY_SLUG[resolution]
        expected[catSlug1].version = CATEGORY_VERSION_BY_SLUG[catSlug1][version]

        expected[catSlug2].selected = true
        expected[catSlug2].subCategories['heavy'].selected = true
        expected[catSlug2].subCategories['fun'].selected = true
        expected[catSlug2].bpms = ['3', '4', '5']
        expected[catSlug2].durations = ['6', '7', '8']

        expect(store.getters.categoryFilters).toMatchObject(expected)
    })
})
