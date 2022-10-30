import Vue from 'vue'
import Vuex from 'vuex'

import { getInjectedJson } from '@/services/get-injected-json'
import { ifIdExists } from '@/utilities/dom'

import AppBrowse from '@/components/AppBrowse.vue'
import Header from '@/components/browse/Header'
import router from '@/router/browse/router'
import browseStore from '@/store/store-browse'

export default function () {
    return ifIdExists('app-browse', function (el) {
        Vue.use(Vuex)

        const store = new Vuex.Store(browseStore)

        // eslint-disable-next-line no-new
        new Vue({
            store,
            router,
            el: '#app-browse',
            render: h => h(AppBrowse)
        })

        const customGallery = getInjectedJson('browse_custom_gallery')

        if (!customGallery) {
            // eslint-disable-next-line no-new
            new Vue({
                ...Header,
                store,
                el: '#browse-header-component'
            })
        }
    })
}
