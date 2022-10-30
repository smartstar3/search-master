<template>
    <div class="homepage-grid">
        <div class="products">
            <product-grid-item
                class="product"
                v-for="product in sortedProducts"
                :key="product.id"
                v-bind="product"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import App from './App'
import { getInjectedJsonOrFail } from '../services/get-injected-json'
import ProductGridItem from './browse/ProductGridItem'

export default {
    name: 'app-browse-latest',

    extends: App,

    components: {
        ProductGridItem
    },

    created() {
        const browseLatest = getInjectedJsonOrFail('browse_latest')

        this.$store.dispatch('setProductsFromApi', {
            products: browseLatest.products,
        })
    },

    computed: {
        ...mapGetters([
            'loading',
            'sortedProducts',
        ])
    }
}
</script>
