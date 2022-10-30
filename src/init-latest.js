import Vue from 'vue'
import Vuex from 'vuex'

import { ifIdExists } from '@/utilities/dom'

import AppBrowseLatest from '@/components/AppBrowseLatest'
import storeLatest from '@/store/store'
import { setLegacyCategorySlugs, setLegacySubCategorySlugs } from '@/store/category-repo'
import { getInjectedJsonOrFail } from '@/services/get-injected-json'

export default function () {
    return ifIdExists('app-browse-latest', function (el) {
        const legacyCategorySlugs = getInjectedJsonOrFail('browse_legacy_category_slugs')
        setLegacyCategorySlugs(legacyCategorySlugs)

        const legacySubCategorySlugs = getInjectedJsonOrFail('browse_legacy_sub_category_slugs')
        setLegacySubCategorySlugs(legacySubCategorySlugs)

        Vue.use(Vuex)

        const store = new Vuex.Store(storeLatest)

        // eslint-disable-next-line no-new
        new Vue({
            el: '#app-browse-latest',
            store,
            render: h => h(AppBrowseLatest)
        })
    })
}
