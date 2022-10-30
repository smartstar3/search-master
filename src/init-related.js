import Vue from 'vue'
import Vuex from 'vuex'

import { ifIdExists } from '@/utilities/dom'

import AppBrowseRelated from '@/components/AppBrowseRelated'
import storeRelated from '@/store/store'

export default function () {
    return ifIdExists('app-browse-related', function (el) {
        Vue.use(Vuex)

        const store = new Vuex.Store(storeRelated)

        // eslint-disable-next-line no-new
        new Vue({
            store,
            el: '#app-browse-related',
            render: h => h(AppBrowseRelated),
        })
    })
}
