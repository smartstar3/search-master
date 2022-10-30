<template>
    <div>
        <transition name="u-fade" mode="out-in">
            <router-view/>
        </transition>
        <login-register-modal/>
    </div>
</template>

<script>
import App from './App'
import LoginRegisterModal from './modal/LoginRegisterModal'
import { getInjectedJson, getInjectedJsonOrFail } from '../services/get-injected-json'

export default {
    name: 'app-browse',

    extends: App,

    components: {
        LoginRegisterModal
    },

    created() {
        this.$router.onReady(route => {
            const customGallery = getInjectedJson('browse_custom_gallery')
            const meta = getInjectedJson('meta')

            if (customGallery) {
                this.$store.dispatch('setProductsFromApi', {
                    products: customGallery.products,
                    currentPage: this.$route.query.page <= meta.last_page ? this.$route.query.page : 1,
                    lastPage: meta.last_page,
                    totalResults: meta.total
                })
            } else {
                const siteTotalProductsCount = getInjectedJsonOrFail('site_total_products_count')
                this.$store.commit('setSiteTotalProductsCount', siteTotalProductsCount)
                this.$store.dispatch('setStateFromRoute', route)
            }
        })
    },

    watch: {
        '$route'(newVal, oldVal) {
            this.$store.dispatch('setStateFromRoute', newVal)
        }
    }
}
</script>

<style lang="scss">
    #app-browse {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
