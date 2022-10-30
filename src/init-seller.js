// We have to use Vue with runtime compiler.
// The template is at laravel's `site.browse.seller` view and is compiled at runtime.
import Vue from 'vue/dist/vue.min'
import Vuex from 'vuex'
import AppSellerProfile from '@/components/AppSellerProfile'
import { setHeaders } from '@/services/seller-api'
import storeConfig from '@/store/store'
import { ifIdExists } from '@/utilities/dom'

export default function () {
    ifIdExists('app-producer-profile', function (el) {
        Vue.use(Vuex)

        const token = document.querySelector('meta[name="_token"]')

        setHeaders({
            'X-CSRF-TOKEN': token !== null ? token.getAttribute('content') : ''
        })

        const store = new Vuex.Store(storeConfig)

        // eslint-disable-next-line no-new
        new Vue({
            ...AppSellerProfile,
            store,
            el: '#app-producer-profile'
        })
    })
}
